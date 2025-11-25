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
    sortDefault: "Default Order",

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
    ach_saved_1000_title: "Piggy Bank",
    ach_saved_1000_desc: "First 1,000 accumulated",
    ach_saved_5000_title: "Banker",
    ach_saved_5000_desc: "5,000 accumulated",
    ach_saved_10000_title: "Tycoon",
    ach_saved_10000_desc: "10,000 accumulated",
    ach_streak_3_title: "Warm Up",
    ach_streak_3_desc: "3 day streak",
    ach_streak_7_title: "Discipline Week",
    ach_streak_7_desc: "7 day streak without skipping",
    ach_half_way_title: "Half Way",
    ach_half_way_desc: "50% of goal reached",
    ach_goal_reached_title: "Dream Come True",
    ach_goal_reached_desc: "Goal fully achieved!",
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
    sortDefault: "По порядку",

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
    ach_saved_1000_title: "Копилка",
    ach_saved_1000_desc: "Накоплена первая 1 000",
    ach_saved_5000_title: "Банкир",
    ach_saved_5000_desc: "Накоплено 5 000",
    ach_saved_10000_title: "Магнат",
    ach_saved_10000_desc: "Накоплено 10 000",
    ach_streak_3_title: "Разминка",
    ach_streak_3_desc: "3 дня подряд вы открываете конверты",
    ach_streak_7_title: "Неделя дисциплины",
    ach_streak_7_desc: "7 дней подряд без пропусков",
    ach_half_way_title: "Экватор",
    ach_half_way_desc: "Половина суммы собрана",
    ach_goal_reached_title: "Мечта сбылась",
    ach_goal_reached_desc: "Цель полностью достигнута!",
  }
};