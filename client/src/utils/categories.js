import { MdCastForEducation, MdOutlineSportsHandball } from "react-icons/md";
import { BsCodeSlash, BsNewspaper } from "react-icons/bs";
import { GiClothes } from "react-icons/gi";

export const CATEGORIES = [
  { label: "NEWS", color: "bg-[#e11d48]", Icon: BsNewspaper },
  { label: "SPORTS", color: "bg-[#2563eb]", Icon: MdOutlineSportsHandball },
  { label: "CODING", color: "bg-[#000000]", Icon: BsCodeSlash },
  { label: "EDUCATION", color: "bg-[#ca8a04]", Icon: MdCastForEducation },
  { label: "FASHION", color: "bg-[#9333ea]", Icon: GiClothes },
];

export const getCategoryColor = (label) =>
  CATEGORIES.find((cat) => cat.label === label)?.color ?? "bg-slate-600";
