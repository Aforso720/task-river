import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/app/api/axiosInstance";

const EMPTY = Object.freeze([]);

const fetchUsers = async () => {
  // если у тебя baseURL уже содержит /api — оставь так
  // если baseURL без /api — поменяй на "/api/admin/users"
  const { data } = await axiosInstance.get("/admin/users");
  return Array.isArray(data) ? data : [];
};

const buildUpdatePayload = (values = {}) => ({
  firstName: values.firstName ?? "",
  lastName: values.lastName ?? "",
  middleName: values.middleName ?? "",
  email: values.email ?? "",
  phoneNumber: values.phoneNumber ?? "",
});

export function useAdminUsers({ enabled = true } = {}) {
  const qc = useQueryClient();

  // ✅ GET users
  const usersQ = useQuery({
    queryKey: ["adminUsers"],
    queryFn: fetchUsers,
    enabled,
    staleTime: 30_000,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  // ✅ DELETE user: /api/admin/delete?userId=
  const deleteM = useMutation({
    mutationFn: async (userId) => {
      await axiosInstance.delete("/admin/delete", { params: { userId } });
      return userId;
    },
    onMutate: async (userId) => {
      await qc.cancelQueries({ queryKey: ["adminUsers"] });
      const prev = qc.getQueryData(["adminUsers"]);

      qc.setQueryData(["adminUsers"], (old = []) =>
        (old || []).filter((u) => String(u.id) !== String(userId))
      );

      return { prev };
    },
    onError: (_err, _userId, ctx) => {
      if (ctx?.prev) qc.setQueryData(["adminUsers"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  // ✅ PUT update: /api/admin/update  + (скорее всего нужен userId)
  // Ты не указал, КАК бэк получает userId при update.
  // Чтобы UI работал для админки, я передаю userId как query param (аналогично delete):
  // PUT /admin/update?userId=xxx  body: { firstName, lastName, middleName, email, phoneNumber }
  const updateM = useMutation({
    mutationFn: async ({ userId, values }) => {
      const payload = buildUpdatePayload(values);

      const { data } = await axiosInstance.put("/admin/update", payload, {
        params: { userId },
      });

      return { userId, data, payload };
    },
    onMutate: async ({ userId, values }) => {
      await qc.cancelQueries({ queryKey: ["adminUsers"] });
      const prev = qc.getQueryData(["adminUsers"]);

      const patch = buildUpdatePayload(values);

      qc.setQueryData(["adminUsers"], (old = []) =>
        (old || []).map((u) => {
          if (String(u.id) !== String(userId)) return u;

          const next = { ...u, ...patch };
          const fullName = `${next.firstName || ""} ${next.middleName || ""} ${next.lastName || ""}`
            .replace(/\s+/g, " ")
            .trim();

          return { ...next, fullName: fullName || next.fullName };
        })
      );

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["adminUsers"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  return {
    users: usersQ.data ?? EMPTY,
    loading: usersQ.isLoading,
    fetching: usersQ.isFetching,
    error: usersQ.error,
    refetch: usersQ.refetch,

    deleteUser: deleteM.mutateAsync,
    deleting: deleteM.isPending,
    deleteError: deleteM.error,

    updateUser: updateM.mutateAsync,
    updating: updateM.isPending,
    updateError: updateM.error,
  };
}
