import axiosInstance from "@/app/api/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchUserData = async () => {
  const { data } = await axiosInstance.get("/user/me");
  return data; 
};

export const useUserData = ({ enabled = true } = {}) => {
  const query = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    enabled,
  });

  return {
    userData: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};



//{
//     userData: {},
//     loading:false,
//     error:null,
//     getUserData : async  () =>{
//        try{
//         set({loading:true})
//         const res = await axiosInstance.get('/user/me')
//         set({userData:res.data , loading:false})
//        }catch(err){
//         set({loading:false, error:err.message})
//        }
//     },
//     putUserData : async (editData) =>{
//        try{
//         set({loading:true})
//         const res = await axiosInstance.put('/user/profile',editData)
//         set({userData:res.data , loading:false})
//        }catch(err){
//         set({loading:false, error:err.message})
//        }
//     },
// }
