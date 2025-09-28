export const labels = {
  en: {
    dashboard: "Dashboard",
    projects: "Projects",
    settings: "Settings",
    welcome: "Welcome back! Here’s your overview.",
    createProject: "Create Project",
    viewBoard: "View Board",
    resetData: "Reset Data",
  },
  ja: {
    dashboard: "ダッシュボード",
    projects: "プロジェクト",
    settings: "設定",
    welcome: "おかえりなさい！概要はこちらです。",
    createProject: "プロジェクトを作成",
    viewBoard: "ボードを見る",
    resetData: "データをリセット",
  },
 
   pl: {
    dashboard: "Panel",
    projects: "Projekty",
    settings: "Ustawienia",
    edit: "Edytuj",
    delete: "Usuń",
    next: "Dalej",
  },
} as const;

export type SupportedLanguage = keyof typeof labels;
