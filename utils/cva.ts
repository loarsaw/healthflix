import { clsx } from "clsx";

const backgroundVariantByScore = (score: number) => {
  return clsx(
    score > 3 ? "bg-black" : "bg-pink",
    "flex-row items-center bg-white rounded-2xl p-5 mb-4 shadow-lg mt-3"
  );
};

const buttonVariantByState = (loading: boolean) => {
  return clsx(loading ? "bg-blue-600" : "bg-green-600", "p-5 rounded-full");
};

export { backgroundVariantByScore, buttonVariantByState };
