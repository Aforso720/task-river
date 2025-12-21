import React, { useState } from "react";
import "./AdminBlog.scss";
import { useSocial } from "../../api/useSocial";
import ConfirmDeleteModal from "@/shared/ConfirmDeleteModal/ConfirmDeleteModal";

const AdminBlog = () => {
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    postId: null,
    postTitle: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { socials, postSocial, getSocials, deleteSocial } = useSocial();

  React.useEffect(() => {
    getSocials();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const year = date.getFullYear();
      
      return `${day}.${month}.${year}`;
    } catch (error) {
      console.error("Ошибка при форматировании даты:", error);
      return dateString;
    }
  };

  const handleReadMoreClick = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
    }
  };

  const getShortDescription = (description) => {
    if (description.length <= 150) return description;
    return description.substring(0, 150) + "...";
  };

  const handleOpenDeleteModal = (postId, postTitle) => {
    setDeleteModal({
      open: true,
      postId,
      postTitle,
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({
      open: false,
      postId: null,
      postTitle: "",
    });
  };

  const handleDeletePost = async () => {
    if (!deleteModal.postId) return;
    
    try {
      setDeleteLoading(true);
      await deleteSocial(deleteModal.postId);
      await getSocials();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Ошибка при удалении поста:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPost.title.trim() || !newPost.description.trim()) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", newPost.title);
      formData.append("description", newPost.description);

      await postSocial(formData);

      setNewPost({
        title: "",
        description: "",
      });

      await getSocials();
    } catch (error) {
      console.error("Ошибка при создании поста:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="AdminBlog flex justify-center items-center flex-col">
      <div className="w-full max-w-4xl mb-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[30px] p-6 shadow-[0_0_10px_0_#00000040] mb-6"
        >
          <h3 className="text-2xl font-bold text-[#22333B] mb-4 font-['TT_Travels_Trl',sans-serif]">
            Добавить новый пост
          </h3>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-lg font-semibold text-[#22333B] mb-2 font-['TT_Travels_Trl',sans-serif]"
            >
              Заголовок
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newPost.title}
              onChange={handleInputChange}
              placeholder="Введите заголовок поста"
              className="w-full p-3 border border-[#8C6D51] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#8C6D51] font-['TT_Travels_Trl',sans-serif] text-[#22333B]"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-lg font-semibold text-[#22333B] mb-2 font-['TT_Travels_Trl',sans-serif]"
            >
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={newPost.description}
              onChange={handleInputChange}
              placeholder="Введите описание поста"
              rows="4"
              className="w-full p-3 border border-[#8C6D51] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-[#8C6D51] font-['TT_Travels_Trl',sans-serif] text-[#22333B] resize-none"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="bg-[#8C6D51] hover:bg-[#7A5E44] font-bold text-xl rounded-[30px] text-[#E6E4D8] px-6 py-3 transition-colors duration-200 font-['TT_Travels_Trl',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Добавление..." : "Добавить пост"}
          </button>
        </form>

        {/* <ul className="listsNavUpdates flex justify-center items-center gap-6 font-bold ">
          <li
            className={
              (listNavActive == 1 ? "activeListNav " : "") +
              "listNavUpdates text-2xl"
            }
            onClick={() => setListNavActive(1)}
          >
            Все
          </li>
          <li
            className={
              (listNavActive == 2 ? "activeListNav " : "") +
              "listNavUpdates text-2xl"
            }
            onClick={() => setListNavActive(2)}
          >
            Функции
          </li>
          <li
            className={
              (listNavActive == 3 ? "activeListNav " : "") +
              "listNavUpdates text-2xl"
            }
            onClick={() => setListNavActive(3)}
          >
            Фиксы
          </li>
          <li
            className={
              (listNavActive == 4 ? "activeListNav " : "") +
              "listNavUpdates text-2xl"
            }
            onClick={() => setListNavActive(4)}
          >
            Обновления интерфейса
          </li>
        </ul> */}
      </div>

      <div className="w-full max-w-[1140px] space-y-8">
        {socials.map((updt) => (
          <article
            className="relative bg-[#E6E4D8] rounded-[30px] shadow-lg shadow-black/25 p-8 font-['TT_Travels_Trl',sans-serif] transition-all duration-300 hover:shadow-xl hover:shadow-black/30 group"
            key={updt.id}
          >
            <button
              onClick={() => handleOpenDeleteModal(updt.id, updt.title)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 group-hover:opacity-100 opacity-0 z-10"
              aria-label="Удалить статью"
              title="Удалить статью"
            >
              <img 
                src="/image/CorzinaTask.svg" 
                alt="Удалить" 
                className="w-5 h-5"
              />
            </button>

            <div className="mb-6 pr-10"> 
              <h4 className="text-3xl text-[#22333B] font-bold mb-3 line-clamp-2 leading-tight">
                {updt.title}
              </h4>
              <div className="h-px bg-[#8C6D51]/30 my-3"></div>
              <span className="text-base text-[#8C6D51] font-medium tracking-wide">
                Дата публикации: {formatDate(updt.createdAt)}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-lg text-[#22333B] leading-relaxed">
                {expandedPostId === updt.id 
                  ? updt.description 
                  : getShortDescription(updt.description)}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => handleReadMoreClick(updt.id)}
                className="text-xl font-bold bg-[#8C6D51] text-[#E6E4D8] rounded-[30px] px-8 py-3 hover:bg-[#7A5D44] transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                {expandedPostId === updt.id ? "Свернуть" : "Подробнее"}
              </button>
            </div>

            {socials.indexOf(updt) !== socials.length - 1 && (
              <div className="h-px bg-[#8C6D51]/20 mt-8"></div>
            )}
          </article>
        ))}
      </div>

      <ConfirmDeleteModal
        open={deleteModal.open}
        itemName={deleteModal.postTitle}
        onConfirm={handleDeletePost}
        onCancel={handleCloseDeleteModal}
        loading={deleteLoading}
      />
    </section>
  );
};

export default AdminBlog;