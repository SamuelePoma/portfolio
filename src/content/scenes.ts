/**
 * Facts the animated scenes spell out, taken from the screenshots themselves.
 * The images are cut from the published screenshots (public/images/scenes).
 */
export const progmaticLayers = [
  {
    id: "workspace",
    label: "Workspace",
    text: "Where the generated brief appears.",
    image: "/images/progmatic-01.webp",
  },
  {
    id: "sidebar",
    label: "Sidebar",
    text: "Overview, chat, files, search, email and FileMaker in one place.",
    image: "/images/scenes/progmatic-sidebar.webp",
  },
  {
    id: "prompt",
    label: "Brief",
    text: "Any engineering subject in, a brief from the workspace and technical knowledge bases out.",
    image: "/images/scenes/progmatic-prompt.webp",
  },
  {
    id: "header",
    label: "Header",
    text: "The page title, the theme switch and the account.",
    image: "/images/scenes/progmatic-header.webp",
  },
] as const;
