export type Language = 'en' | 'ru';

export const translations = {
  en: {
    // Setup
    createGoal: "Create a Goal",
    createGoalDesc: "Set your target, and we'll create a personal savings plan for you.",
    howMuch: "Target Amount",
    howMuchPlaceholder: "e.g. 50000",
    howMuchError: "Please enter a valid amount.",
    minAmountError: (days: number) => `Target amount must be at least ${days} (min 1 per day).`,
    duration: "Duration (Days)",
    week: "1 week",
    year: "1 year",
    distribution: "Distribution Mode",
    currency: "Currency",
    startChallenge: "Start Challenge",
    
    // Modes
    modeEqual: "Equal",
    modeEqualDesc: "Same amount daily",
    modeProgression: "Progression",
    modeProgressionDesc: "Low to high",
    modeRandom: "Random",
    modeRandomDesc: "Balanced mix",

    // Dashboard
    goalProgress: "Goal Progress",
    saved: "Saved",
    remaining: "Remaining",
    envelopesOpened: "Envelopes Opened",
    progress: "Progress",
    yourEnvelopes: "Your Envelopes",
    filterAll: "All",
    filterClosed: "Closed",
    filterOpened: "Opened",
    emptyCategory: "No envelopes in this category.",
    sortByAmount: "Sort by Amount",
    sortDefault: "Sort by Day",

    // Envelopes
    day: "Day",
    envelope: "Envelope",
    tapToOpen: "Tap to open",
    
    // Settings & Reset
    settings: "Settings",
    language: "Language",
    currencyUpdateNote: "Changing currency will update the display format.",
    done: "Done",
    reset: "Reset",
    resetTitle: "Reset Progress?",
    resetDesc: "You will lose all savings history and achievements. This action cannot be undone.",
    cancel: "Cancel",
    confirmReset: "Reset",

    // Achievements
    achievements: "Achievements",
    
    // Achievement Titles/Descs
    ach_first_step_title: "First Step",
    ach_first_step_desc: "Open your first envelope",
    
    ach_saved_10_percent_title: "Seed Capital",
    ach_saved_10_percent_desc: (amount: string) => `First ${amount} saved! You're on your way.`,
    
    ach_saved_25_percent_title: "Momentum Builder",
    ach_saved_25_percent_desc: (amount: string) => `25% down! That's ${amount} in the bank.`,
    
    ach_saved_50_percent_title: "Halfway Hero",
    ach_saved_50_percent_desc: (amount: string) => `Whoa, 50% reached! ${amount} secured.`,
    
    ach_saved_75_percent_title: "Final Stretch",
    ach_saved_75_percent_desc: (amount: string) => `75% done! You have ${amount} now.`,
    
    ach_streak_3_title: "Heating Up",
    ach_streak_3_desc: "3 day streak. Keep the fire burning!",
    
    ach_streak_7_title: "Unstoppable",
    ach_streak_7_desc: "7 days in a row! That's a full week.",
    
    ach_streak_21_title: "Habit Master",
    ach_streak_21_desc: "21 days! A new habit is formed.",
    
    ach_goal_reached_title: "Goal Crusher",
    ach_goal_reached_desc: (amount: string) => `You did it! ${amount} is all yours.`,
  },
  ru: {
    // Setup
    createGoal: "Создать цель",
    createGoalDesc: "Задайте параметры, и мы создадим для вас персональный план накоплений.",
    howMuch: "Сколько хотите накопить?",
    howMuchPlaceholder: "например 50000",
    howMuchError: "Пожалуйста, введите корректную сумму.",
    minAmountError: (days: number) => `Сумма накопления должна быть не меньше ${days} (минимум 1 на день).`,
    duration: "Срок челленджа (дней)",
    week: "1 неделя",
    year: "1 год",
    distribution: "Режим распределения",
    currency: "Валюта",
    startChallenge: "Начать челлендж",

    // Modes
    modeEqual: "Равные",
    modeEqualDesc: "Одинаковые суммы",
    modeProgression: "Прогрессия",
    modeProgressionDesc: "От малого к большому",
    modeRandom: "Рандом",
    modeRandomDesc: "Умеренный разброс",

    // Dashboard
    goalProgress: "Прогресс цели",
    saved: "Накоплено",
    remaining: "Осталось собрать",
    envelopesOpened: "Конвертов открыто",
    progress: "Прогресс",
    yourEnvelopes: "Ваши конверты",
    filterAll: "Все",
    filterClosed: "Закрытые",
    filterOpened: "Открытые",
    emptyCategory: "В этой категории пока нет конвертов.",
    sortByAmount: "По сумме",
    sortDefault: "По дню",

    // Envelopes
    day: "День",
    envelope: "Конверт",
    tapToOpen: "Нажми, чтобы открыть",

    // Settings & Reset
    settings: "Настройки",
    language: "Язык",
    currencyUpdateNote: "Изменение валюты обновит отображение всех сумм.",
    done: "Готово",
    reset: "Сбросить",
    resetTitle: "Сбросить прогресс?",
    resetDesc: "Вы потеряете всю историю накоплений и достижения. Это действие нельзя отменить.",
    cancel: "Отмена",
    confirmReset: "Сбросить",

    // Achievements
    achievements: "Достижения",

    // Achievement Titles/Descs
    ach_first_step_title: "Первый шаг",
    ach_first_step_desc: "Откройте свой первый конверт",
    
    ach_saved_10_percent_title: "Начало положено",
    ach_saved_10_percent_desc: (amount: string) => `Первые ${amount} накоплены! Так держать.`,
    
    ach_saved_25_percent_title: "Набираем обороты",
    ach_saved_25_percent_desc: (amount: string) => `25% пути позади! У вас уже ${amount}.`,
    
    ach_saved_50_percent_title: "Экватор",
    ach_saved_50_percent_desc: (amount: string) => `Половина цели! ${amount} уже в кармане.`,
    
    ach_saved_75_percent_title: "Финишная прямая",
    ach_saved_75_percent_desc: (amount: string) => `75% готово! Вы накопили ${amount}.`,
    
    ach_streak_3_title: "Разогрев",
    ach_streak_3_desc: "3 дня подряд. Отличное начало!",
    
    ach_streak_7_title: "На волне",
    ach_streak_7_desc: "7 дней подряд! Неделя дисциплины.",
    
    ach_streak_21_title: "Мастер привычки",
    ach_streak_21_desc: "21 день подряд! Привычка сформирована.",
    
    ach_goal_reached_title: "Победа!",
    ach_goal_reached_desc: (amount: string) => `Вы сделали это! ${amount} ваши.`,
  }
};