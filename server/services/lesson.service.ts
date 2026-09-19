export interface TestCase {
  id: string;
  name: string;
  description: string;
  testFunction: string; // JavaScript snippet executed in runner
  expected: string;
}

export interface Lesson {
  id: string;
  title: string;
  trackId: string;
  trackName: string;
  order: number;
  xp: number;
  icon: string;
  difficulty: 'Beginner' | 'Novice' | 'Apprentice';
  storyIntro: string;
  conceptExplanation: string;
  instructions: string[];
  starterCode: string;
  solutionHint: string;
  testCases: TestCase[];
}

export interface Track {
  id: string;
  title: string;
  description: string;
  badgeName: string;
  badgeIcon: string;
  totalXp: number;
  lessonCount: number;
}

export const TRACKS: Track[] = [
  {
    id: 'fundamentals',
    title: 'Track 1: Novice Grove',
    description: 'Master the core building blocks: printing, variables, data types, and party arrays.',
    badgeName: 'Grove Ranger',
    badgeIcon: 'Zap',
    totalXp: 450,
    lessonCount: 4,
  },
  {
    id: 'logic',
    title: 'Track 2: Cyber Dungeon',
    description: 'Navigate branching paths, dungeon locks, and combat loops with conditionals.',
    badgeName: 'Logic Knight',
    badgeIcon: 'ShieldAlert',
    totalXp: 450,
    lessonCount: 3,
  },
  {
    id: 'functions',
    title: 'Track 3: Arcade Citadel',
    description: 'Inscribe powerful reusable spell functions and conquer the Grand Arcade Boss.',
    badgeName: 'Arcade Grandmaster',
    badgeIcon: 'Trophy',
    totalXp: 550,
    lessonCount: 3,
  },
];

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-1-neon-console',
    title: 'The Neon Console',
    trackId: 'fundamentals',
    trackName: 'Track 1: Novice Grove',
    order: 1,
    xp: 100,
    icon: 'Terminal',
    difficulty: 'Beginner',
    storyIntro:
      'Welcome to CodeArcade! You stand before the ancient Marquee Screen. To activate your player badge, you must broadcast your first transmission to the arcade console.',
    conceptExplanation:
      'In JavaScript, `console.log()` is your megaphone. Anything you put between the parentheses `(...)` gets printed to the terminal screen. Strings of text must be wrapped inside quotation marks, like `"Hello, World!"`.',
    instructions: [
      'Use `console.log()` to print `"Ready Player One"` to the terminal.',
      'Make sure to wrap the words in quotation marks and end with a closing parenthesis.',
    ],
    starterCode: `// Quest 1: Activate the Neon Console!
// Type console.log("Ready Player One"); below:

`,
    solutionHint: 'console.log("Ready Player One");',
    testCases: [
      {
        id: 'tc-1',
        name: 'Console output contains "Ready Player One"',
        description: 'Verify console logs the exact phrase',
        testFunction: `__logs.some(l => typeof l === 'string' && l.trim().toLowerCase() === 'ready player one')`,
        expected: 'Ready Player One',
      },
    ],
  },
  {
    id: 'lesson-2-variables',
    title: 'Inventory Chests',
    trackId: 'fundamentals',
    trackName: 'Track 1: Novice Grove',
    order: 2,
    xp: 100,
    icon: 'Package',
    difficulty: 'Beginner',
    storyIntro:
      'Every hero needs an inventory! In the arcade, you can store hero names, gold coins, and hit points in labeled memory containers called variables.',
    conceptExplanation:
      'Use `let` to declare a container that can change later, or `const` for values that stay locked. For example: `let hero = "Pixel";` and `const maxHealth = 100;`.',
    instructions: [
      'Create a variable named `heroName` with value `"Pixel"`.',
      'Create a variable named `coins` with the number `50`.',
      'Print both variables using `console.log(heroName)` and `console.log(coins)`.',
    ],
    starterCode: `// Quest 2: Set up your hero inventory
// 1. Declare heroName and set it to "Pixel"
// 2. Declare coins and set it to 50
// 3. Output both with console.log

let heroName = "Pixel";
let coins = 50;

console.log(heroName);
console.log(coins);
`,
    solutionHint: 'let heroName = "Pixel";\nlet coins = 50;\nconsole.log(heroName);\nconsole.log(coins);',
    testCases: [
      {
        id: 'tc-2a',
        name: 'heroName is declared as "Pixel"',
        description: 'Checks if heroName equals Pixel',
        testFunction: `typeof heroName !== 'undefined' && heroName === 'Pixel'`,
        expected: 'heroName === "Pixel"',
      },
      {
        id: 'tc-2b',
        name: 'coins is declared as 50',
        description: 'Checks if coins equals 50',
        testFunction: `typeof coins !== 'undefined' && coins === 50`,
        expected: 'coins === 50',
      },
      {
        id: 'tc-2c',
        name: 'Logs both values to console',
        description: 'Checks that console received both outputs',
        testFunction: `__logs.includes("Pixel") && __logs.some(l => l == 50)`,
        expected: 'Console logs Pixel and 50',
      },
    ],
  },
  {
    id: 'lesson-3-math-operators',
    title: 'Power-Up Calculations',
    trackId: 'fundamentals',
    trackName: 'Track 1: Novice Grove',
    order: 3,
    xp: 125,
    icon: 'Zap',
    difficulty: 'Beginner',
    storyIntro:
      'You grabbed a glowing double-damage star! To compute your damage against enemy bugs, use JavaScript mathematical operators.',
    conceptExplanation:
      'JavaScript supports standard arithmetic: `+` (add), `-` (subtract), `*` (multiply), and `/` (divide). You can also join strings together with `+`, like `"Score: " + 200`.',
    instructions: [
      'Declare `baseDamage` with a value of `25`.',
      'Declare `multiplier` with a value of `2`.',
      'Calculate `totalDamage` by multiplying `baseDamage * multiplier`.',
      'Print `totalDamage` with `console.log(totalDamage)`.',
    ],
    starterCode: `// Quest 3: Power-Up Calculations
// Calculate totalDamage from baseDamage and multiplier

let baseDamage = 25;
let multiplier = 2;
// Declare totalDamage below:


`,
    solutionHint: 'let baseDamage = 25;\nlet multiplier = 2;\nlet totalDamage = baseDamage * multiplier;\nconsole.log(totalDamage);',
    testCases: [
      {
        id: 'tc-3a',
        name: 'totalDamage is accurately calculated as 50',
        description: 'Verify 25 * 2 = 50',
        testFunction: `typeof totalDamage !== 'undefined' && totalDamage === 50`,
        expected: '50',
      },
      {
        id: 'tc-3b',
        name: 'Output is printed to the console',
        description: 'Verify console.log(totalDamage)',
        testFunction: `__logs.some(l => l == 50)`,
        expected: '50 logged to console',
      },
    ],
  },
  {
    id: 'lesson-4-arrays',
    title: 'Party Roster Arrays',
    trackId: 'fundamentals',
    trackName: 'Track 1: Novice Grove',
    order: 4,
    xp: 125,
    icon: 'Users',
    difficulty: 'Novice',
    storyIntro:
      'You cannot defeat the Cyber Dungeon alone. Form an adventuring party using an Array—a ordered list of items enclosed in square brackets.',
    conceptExplanation:
      'Arrays store multiple values: `const party = ["Knight", "Mage", "Rogue"];`. Array positions start at 0! So `party[0]` is `"Knight"`. Add new members with `party.push("Healer")`.',
    instructions: [
      'Create an array named `party` containing `"Warrior"`, `"Mage"`, and `"Archer"`.',
      'Add `"Cleric"` to the end using `party.push("Cleric")`.',
      'Print the first member of the party using `console.log(party[0])`.',
    ],
    starterCode: `// Quest 4: Assemble your adventuring party!
// 1. Create party array with "Warrior", "Mage", "Archer"
// 2. Push "Cleric" to party
// 3. Log the first member (index 0)

const party = ["Warrior", "Mage", "Archer"];

`,
    solutionHint: 'const party = ["Warrior", "Mage", "Archer"];\nparty.push("Cleric");\nconsole.log(party[0]);',
    testCases: [
      {
        id: 'tc-4a',
        name: 'party contains 4 members including Cleric',
        description: 'Verify party array length is 4',
        testFunction: `Array.isArray(party) && party.length === 4 && party.includes("Cleric")`,
        expected: 'party has 4 members including Cleric',
      },
      {
        id: 'tc-4b',
        name: 'Logs first member "Warrior" to console',
        description: 'Verify console.log(party[0])',
        testFunction: `__logs.includes("Warrior")`,
        expected: '"Warrior" in logs',
      },
    ],
  },
  {
    id: 'lesson-5-conditionals',
    title: "Gatekeeper's Riddle",
    trackId: 'logic',
    trackName: 'Track 2: Cyber Dungeon',
    order: 5,
    xp: 150,
    icon: 'ShieldAlert',
    difficulty: 'Novice',
    storyIntro:
      'A massive stone sentinel blocks the gate. "Halt! State your key code!" You must evaluate conditions to decide whether the gate opens or slams shut.',
    conceptExplanation:
      'Use `if` and `else` to branch logic:\n```javascript\nif (score >= 100) {\n  console.log("Passed");\n} else {\n  console.log("Try again");\n}\n```\nCheck strict equality with `===`.',
    instructions: [
      'Declare `hasKey` and set it to `true`.',
      'Write an `if / else` statement: if `hasKey === true`, print `"Gate Unlocked!"`. Otherwise, print `"Access Denied"`.',
    ],
    starterCode: `// Quest 5: Gatekeeper's Riddle
let hasKey = true;

// Write your if / else statement here:

`,
    solutionHint: 'let hasKey = true;\nif (hasKey === true) {\n  console.log("Gate Unlocked!");\n} else {\n  console.log("Access Denied");\n}',
    testCases: [
      {
        id: 'tc-5a',
        name: 'Prints "Gate Unlocked!" when hasKey is true',
        description: 'Checks output condition',
        testFunction: `__logs.includes("Gate Unlocked!")`,
        expected: '"Gate Unlocked!"',
      },
    ],
  },
  {
    id: 'lesson-6-logical-operators',
    title: 'The Double Shield',
    trackId: 'logic',
    trackName: 'Track 2: Cyber Dungeon',
    order: 6,
    xp: 150,
    icon: 'Flame',
    difficulty: 'Novice',
    storyIntro:
      'A dragon breathes plasma! To survive, your hero must have both a Magic Shield AND more than 20 Energy. Combine conditions with the logical AND (`&&`) operator.',
    conceptExplanation:
      'Logical AND `&&` requires BOTH sides to be true. Logical OR `||` requires AT LEAST ONE side to be true.\n`if (hasShield && energy > 20) { ... }`',
    instructions: [
      'Declare `hasShield = true` and `energy = 30`.',
      'If `hasShield` is true AND `energy > 20`, print `"Shield Active"`.',
      'Else print `"Shield Broken"`.',
    ],
    starterCode: `// Quest 6: The Double Shield
let hasShield = true;
let energy = 30;

// Combine conditions using && below:

`,
    solutionHint: 'let hasShield = true;\nlet energy = 30;\nif (hasShield && energy > 20) {\n  console.log("Shield Active");\n} else {\n  console.log("Shield Broken");\n}',
    testCases: [
      {
        id: 'tc-6a',
        name: 'Outputs "Shield Active" for shield and sufficient energy',
        description: 'Verifies boolean logic combination',
        testFunction: `__logs.includes("Shield Active")`,
        expected: '"Shield Active"',
      },
    ],
  },
  {
    id: 'lesson-7-loops',
    title: 'Boss Combo Repeater',
    trackId: 'logic',
    trackName: 'Track 2: Cyber Dungeon',
    order: 7,
    xp: 150,
    icon: 'RotateCw',
    difficulty: 'Novice',
    storyIntro:
      'The Cyber Golem regenerates unless you execute a 3-hit combo in rapid succession! Use a `for` loop to repeat your attack without writing duplicate code.',
    conceptExplanation:
      'A `for` loop repeats a code block:\n```javascript\nfor (let i = 1; i <= 3; i++) {\n  console.log("Hit " + i);\n}\n```\nHere, `i = 1` starts the counter, `i <= 3` is the continue check, and `i++` increments.',
    instructions: [
      'Write a `for` loop that runs from `1` to `3` (inclusive).',
      'Inside the loop, use `console.log("Combo Hit " + i)` to print each hit.',
    ],
    starterCode: `// Quest 7: Execute a 3-hit combo with a for loop!

for (let i = 1; i <= 3; i++) {
  // Log "Combo Hit " + i here
}
`,
    solutionHint: 'for (let i = 1; i <= 3; i++) {\n  console.log("Combo Hit " + i);\n}',
    testCases: [
      {
        id: 'tc-7a',
        name: 'Console contains Combo Hit 1, Combo Hit 2, and Combo Hit 3',
        description: 'Checks repeated iteration',
        testFunction: `__logs.includes("Combo Hit 1") && __logs.includes("Combo Hit 2") && __logs.includes("Combo Hit 3")`,
        expected: 'Combo Hit 1, Combo Hit 2, Combo Hit 3',
      },
    ],
  },
  {
    id: 'lesson-8-functions',
    title: 'Spellcasting Functions',
    trackId: 'functions',
    trackName: 'Track 3: Arcade Citadel',
    order: 8,
    xp: 175,
    icon: 'Wand2',
    difficulty: 'Apprentice',
    storyIntro:
      'Why cast a spell once when you can teach your wand to cast it on command? Functions are reusable spell scrolls that take inputs (parameters) and trigger actions.',
    conceptExplanation:
      'Define a function with the `function` keyword:\n```javascript\nfunction healPlayer(hero, amount) {\n  console.log(hero + " recovered " + amount + " HP!");\n}\nhealPlayer("Pixel", 20);\n```',
    instructions: [
      'Write a function named `castFireball` that accepts one parameter: `target`.',
      'Inside the function, print `"Fireball hits " + target + "!"`.',
      'Call `castFireball("Dragon")`.',
    ],
    starterCode: `// Quest 8: Inscribe your first spell function!
function castFireball(target) {
  // print the attack message
}

// Call the function with "Dragon"
`,
    solutionHint: 'function castFireball(target) {\n  console.log("Fireball hits " + target + "!");\n}\ncastFireball("Dragon");',
    testCases: [
      {
        id: 'tc-8a',
        name: 'castFireball is a declared function',
        description: 'Verify function exists',
        testFunction: `typeof castFireball === 'function'`,
        expected: 'castFireball is defined',
      },
      {
        id: 'tc-8b',
        name: 'Calling function prints "Fireball hits Dragon!"',
        description: 'Verify console output from function call',
        testFunction: `__logs.includes("Fireball hits Dragon!")`,
        expected: '"Fireball hits Dragon!"',
      },
    ],
  },
  {
    id: 'lesson-9-returns',
    title: 'The Golden Return',
    trackId: 'functions',
    trackName: 'Track 3: Arcade Citadel',
    order: 9,
    xp: 175,
    icon: 'Gift',
    difficulty: 'Apprentice',
    storyIntro:
      'Printing to the screen is great, but real arcade spells return calculated values back to your inventory so you can use them in further calculations!',
    conceptExplanation:
      '`console.log()` just displays a message. `return` hands a value back to the caller:\n```javascript\nfunction addScore(current, bonus) {\n  return current + bonus;\n}\nconst newScore = addScore(100, 50); // newScore is 150\n```',
    instructions: [
      'Create a function named `calculateReward` that takes `questsDone` and `bonusMultiplier`.',
      'It must `return` the result of `questsDone * bonusMultiplier`.',
      'Call `calculateReward(5, 10)` and store it in `let totalReward`.',
      'Log `totalReward` to the console.',
    ],
    starterCode: `// Quest 9: The Golden Return
function calculateReward(questsDone, bonusMultiplier) {
  // Return the product of both parameters
}

let totalReward = calculateReward(5, 10);
console.log(totalReward);
`,
    solutionHint: 'function calculateReward(questsDone, bonusMultiplier) {\n  return questsDone * bonusMultiplier;\n}\nlet totalReward = calculateReward(5, 10);\nconsole.log(totalReward);',
    testCases: [
      {
        id: 'tc-9a',
        name: 'calculateReward returns accurate multiplied value',
        description: 'Tests 5 * 10 = 50 and 3 * 7 = 21',
        testFunction: `typeof calculateReward === 'function' && calculateReward(5, 10) === 50 && calculateReward(3, 7) === 21`,
        expected: 'calculateReward(5, 10) === 50',
      },
      {
        id: 'tc-9b',
        name: 'totalReward holds 50',
        description: 'Verify assigned variable',
        testFunction: `typeof totalReward !== 'undefined' && totalReward === 50`,
        expected: 'totalReward === 50',
      },
    ],
  },
  {
    id: 'lesson-10-boss-battle',
    title: 'The Grand Arcade Boss Battle',
    trackId: 'functions',
    trackName: 'Track 3: Arcade Citadel',
    order: 10,
    xp: 200,
    icon: 'Trophy',
    difficulty: 'Apprentice',
    storyIntro:
      'GLITCH, the corrupted Arcade Sentinel, awakens! Synthesize everything you have learned: variables, arrays, conditionals, and functions to calculate the winning boss strike!',
    conceptExplanation:
      'Mastery combines all four pillars: Store party members in an array, use a function to calculate strike damage with a critical hit conditional, and return the final victory report.',
    instructions: [
      'Declare `const bossHp = 100`.',
      'Create a function `attackBoss(heroName, baseDamage, isCritical)`',
      'Inside `attackBoss`, if `isCritical` is true, damage is `baseDamage * 2`, otherwise it is `baseDamage`.',
      'If damage is greater than or equal to `bossHp`, return `"GLITCH Defeated!"`, otherwise return `"Boss still standing"`.',
      'Call `attackBoss("Pixel", 60, true)` and log the outcome.',
    ],
    starterCode: `// Boss Quest: The Grand Arcade Boss Battle!
const bossHp = 100;

function attackBoss(heroName, baseDamage, isCritical) {
  let damage = isCritical ? baseDamage * 2 : baseDamage;
  if (damage >= bossHp) {
    return "GLITCH Defeated!";
  } else {
    return "Boss still standing";
  }
}

const battleResult = attackBoss("Pixel", 60, true);
console.log(battleResult);
`,
    solutionHint: `const bossHp = 100;\nfunction attackBoss(heroName, baseDamage, isCritical) {\n  let damage = isCritical ? baseDamage * 2 : baseDamage;\n  if (damage >= bossHp) {\n    return "GLITCH Defeated!";\n  } else {\n    return "Boss still standing";\n  }\n}\nconst battleResult = attackBoss("Pixel", 60, true);\nconsole.log(battleResult);`,
    testCases: [
      {
        id: 'tc-10a',
        name: 'attackBoss correctly calculates critical damage and defeats boss',
        description: '60 * 2 = 120 >= 100 returns GLITCH Defeated!',
        testFunction: `typeof attackBoss === 'function' && attackBoss("Pixel", 60, true) === "GLITCH Defeated!"`,
        expected: '"GLITCH Defeated!"',
      },
      {
        id: 'tc-10b',
        name: 'attackBoss correctly handles non-critical strike',
        description: '40 damage without crit returns Boss still standing',
        testFunction: `typeof attackBoss === 'function' && attackBoss("Pixel", 40, false) === "Boss still standing"`,
        expected: '"Boss still standing"',
      },
      {
        id: 'tc-10c',
        name: 'Victory message logged to console',
        description: 'Verify console output',
        testFunction: `__logs.includes("GLITCH Defeated!")`,
        expected: '"GLITCH Defeated!" in logs',
      },
    ],
  },
];

export class LessonService {
  public static getAllTracks(): Track[] {
    return TRACKS;
  }

  public static getAllLessons(): Lesson[] {
    return LESSONS;
  }

  public static getLessonById(id: string): Lesson | undefined {
    return LESSONS.find(l => l.id === id);
  }

  public static getLessonsByTrack(trackId: string): Lesson[] {
    return LESSONS.filter(l => l.trackId === trackId);
  }
}
