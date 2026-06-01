import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import useStore from "../store";

const ThemeSwitch = () => {
  const { theme, setTheme } = useStore();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      type='button'
      aria-label='Toggle theme'
      onClick={toggleTheme}
      className={`relative flex h-7 w-14 items-center rounded-full p-1 transition-colors ${
        isDark ? "bg-slate-700" : "bg-slate-200"
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs shadow transition-transform ${
          isDark ? "translate-x-7 text-slate-700" : "translate-x-0 text-amber-500"
        }`}
      >
        {isDark ? <BsMoonStarsFill /> : <BsSunFill />}
      </span>
    </button>
  );
};

export default ThemeSwitch;
