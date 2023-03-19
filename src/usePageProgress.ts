import useScrollTop from "./useScrollTop";

const usePageProgress = () => {
  const scrollTop = useScrollTop();
  const pageHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  return scrollTop / (pageHeight - windowHeight);
};

export default usePageProgress;
