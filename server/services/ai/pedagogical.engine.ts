import {
  HintRequest,
  HintResponse,
  ExplainRequest,
  ExplainResponse,
  ReviewRequest,
  ReviewResponse,
  ChatRequest,
  ChatResponse,
} from './schemas';

/**
 * Intelligent Pedagogical Simulation Engine
 * Serves as a resilient fallback and instant offline tutor capable of context-aware,
 * Socratic tutoring without exposing students to latency or missing-key outages.
 */
export class PedagogicalEngine {
  /**
   * Generates incremental hints (Level 1: Nudge, Level 2: Syntax, Level 3: Pattern)
   */
  public static generateHint(request: HintRequest): HintResponse {
    const { lessonId, lessonTitle, userCode, currentHintLevel, failedTest } = request;

    // Detect common patterns
    const code = userCode.trim();
    const hasConsoleLog = /console\.log\s*\(/.test(code);
    const hasLet = /\blet\b/.test(code);
    const hasConst = /\bconst\b/.test(code);
    const hasFunction = /\bfunction\b/.test(code) || /=>/.test(code);
    const hasReturn = /\breturn\b/.test(code);

    if (currentHintLevel === 1) {
      // Level 1: Gentle Conceptual Nudge
      let nudge = `Take a close look at the mission goal for "${lessonTitle}". Think about the data flow before typing!`;
      let guidingQuestion = 'What is the primary action or storage box the challenge asks you to create?';
      let funAnalogy = 'Like picking the right item slot in your RPG backpack before embarking on the quest.';

      if (lessonId.includes('console') || lessonId.includes('1')) {
        nudge = 'To broadcast a message in the neon arcade, your program needs an output megaphone.';
        guidingQuestion = 'Which JavaScript command prints text out to the terminal screen?';
        funAnalogy = 'Think of console.log as your character speaking a dialogue bubble into the game world.';
      } else if (lessonId.includes('variable') || lessonId.includes('2')) {
        nudge = 'Variables are labeled containers. You pick a label name and store a value inside using the assignment symbol.';
        guidingQuestion = 'Do you need a variable that can change later (`let`) or one that stays locked (`const`)?';
        funAnalogy = 'A treasure chest with a name tag stuck on the front.';
      } else if (lessonId.includes('math') || lessonId.includes('3')) {
        nudge = 'Computers are supersonic calculators. Operators like +, -, * let you combine values together.';
        guidingQuestion = 'Are you joining two pieces of text together, or adding numbers?';
        funAnalogy = 'Fusing two elemental power-ups together into a stronger combo!';
      } else if (lessonId.includes('array') || lessonId.includes('4')) {
        nudge = 'Arrays let you store an entire party roster inside a single variable using square brackets [].';
        guidingQuestion = 'Remember: what number does the very first item index start at in JavaScript?';
        funAnalogy = 'A row of arcade game slots numbered 0, 1, 2, 3...';
      } else if (lessonId.includes('if') || lessonId.includes('5') || lessonId.includes('logic')) {
        nudge = 'Conditional statements check if a condition is true before unlocking the treasure door.';
        guidingQuestion = 'What comparison operator checks if two values are strictly equal?';
        funAnalogy = 'A dungeon gate that only opens if your inventory has the Golden Key.';
      } else if (lessonId.includes('function') || lessonId.includes('8') || lessonId.includes('9')) {
        nudge = 'Functions are reusable magic scrolls. You write the spell once, and call it whenever you need that power.';
        guidingQuestion = 'Does your function return a value back to the player, or just do something silently?';
        funAnalogy = 'A vending machine: you drop in an input coin, push the button, and it returns a potion!';
      }

      return {
        hintLevel: 1,
        title: `Pixel's Gentle Nudge: Level 1`,
        nudge,
        guidingQuestion,
        funAnalogy,
        targetedArea: 'Overall structure & concept',
      };
    }

    if (currentHintLevel === 2) {
      // Level 2: Targeted Syntax & Area Clue
      let nudge = 'Check your syntax and variable names carefully. Look at punctuation like quotes, brackets, and semicolons.';
      let guidingQuestion = 'Did you spell every variable name with the exact same uppercase and lowercase letters?';
      let targetedArea = 'Look at your declaration keyword and assignments';

      if (!hasConsoleLog && (lessonId.includes('1') || lessonId.includes('console'))) {
        nudge = 'You are missing the `console.log(...)` statement. Wrap your message in parentheses!';
        targetedArea = 'Add console.log(...) at the bottom of your script';
      } else if (!hasLet && !hasConst && (lessonId.includes('2') || lessonId.includes('variable'))) {
        nudge = 'Remember to declare your variable using `let` or `const` before the variable name.';
        targetedArea = 'Variable declaration syntax: let name = value;';
      } else if (hasFunction && !hasReturn && (lessonId.includes('9') || lessonId.includes('return'))) {
        nudge = 'Your function is missing a `return` keyword! Without `return`, the function returns `undefined`.';
        targetedArea = 'Inside the function body: return ...;';
      } else if (failedTest) {
        nudge = `The test is checking for: "${failedTest}". Check if your output matches character-for-character.`;
        guidingQuestion = 'Is there an accidental extra space or lowercase/uppercase difference?';
      }

      return {
        hintLevel: 2,
        title: `Pixel's Targeted Syntax Clue: Level 2`,
        nudge,
        guidingQuestion,
        targetedArea,
        funAnalogy: 'Like adjusting your joystick sensitivity right before executing a combo move.',
      };
    }

    // Level 3: Pseudocode / Fill-in-the-blank Pattern (Never raw solution!)
    let pseudocodeClue = '// Pattern:\nkeyword variableName = value;\nconsole.log(variableName);';
    let nudge = 'Here is the structural blueprint. Fill in your specific challenge values into the blank spots!';

    if (lessonId.includes('console') || lessonId.includes('1')) {
      pseudocodeClue = `console.log("Your arcade message here");`;
    } else if (lessonId.includes('variable') || lessonId.includes('2')) {
      pseudocodeClue = `// Declare your player stats:\nlet playerName = "???";\nconst startingGold = ???;\nconsole.log(playerName);`;
    } else if (lessonId.includes('math') || lessonId.includes('3')) {
      pseudocodeClue = `// Calculate score power-up:\nlet baseScore = 100;\nlet bonusScore = 50;\nlet totalScore = baseScore + bonusScore;`;
    } else if (lessonId.includes('array') || lessonId.includes('4')) {
      pseudocodeClue = `// Party roster array:\nconst inventory = ["Potion", "Sword", "Shield"];\n// Access first item with index [0]\nconsole.log(inventory[0]);`;
    } else if (lessonId.includes('if') || lessonId.includes('5')) {
      pseudocodeClue = `if (playerScore >= 100) {\n  console.log("Stage Cleared!");\n} else {\n  console.log("Keep Trying!");\n}`;
    } else if (lessonId.includes('function') || lessonId.includes('8') || lessonId.includes('9')) {
      pseudocodeClue = `function castSpell(spellName, powerLevel) {\n  // Combine parameters and return result\n  return spellName + " with power " + powerLevel;\n}`;
    }

    return {
      hintLevel: 3,
      title: `Pixel's Structural Blueprint: Level 3`,
      nudge,
      guidingQuestion: 'Can you replace the placeholders with the values asked in your quest objectives?',
      pseudocodeClue,
      funAnalogy: 'A LEGO instruction manual showing which block goes where without assembling it for you!',
    };
  }

  /**
   * Generates step-by-step code explanation with mental models
   */
  public static explainCode(request: ExplainRequest): ExplainResponse {
    const { lessonTitle, userCode } = request;
    const lines = userCode.split('\n').filter(l => l.trim().length > 0);

    const breakdown = lines.map((line) => {
      const trimmed = line.trim();
      let explanation = 'Executes a JavaScript instruction.';
      let arcadeAnalogy = 'A game action carried out by the engine.';

      if (trimmed.startsWith('//')) {
        explanation = 'A developer comment. The computer ignores this line—it is notes left for humans!';
        arcadeAnalogy = 'Like secret graffiti notes left on a dungeon wall.';
      } else if (trimmed.startsWith('console.log')) {
        explanation = 'Outputs the evaluated value inside the parentheses to the CodeArcade terminal output.';
        arcadeAnalogy = 'Broadcasting a message on the arcade marquee billboard.';
      } else if (trimmed.startsWith('const ') || trimmed.startsWith('let ')) {
        const varName = trimmed.split(' ')[1]?.replace(/[^a-zA-Z0-9_$]/g, '') || 'item';
        explanation = `Creates a dedicated memory container named '${varName}' and stores the value on the right-hand side.`;
        arcadeAnalogy = `Labeling a golden vault box '${varName}' and locking your loot inside.`;
      } else if (trimmed.includes('function')) {
        explanation = 'Defines a reusable block of instructions that will execute whenever called.';
        arcadeAnalogy = 'Inscribing a magical combo recipe into your spellbook.';
      } else if (trimmed.includes('return')) {
        explanation = 'Hands the final computed result back to whoever triggered this function, ending execution of the block.';
        arcadeAnalogy = 'The arcade machine dispensing your earned prize tickets!';
      } else if (trimmed.startsWith('if')) {
        explanation = 'A decision fork: checks whether the condition is true before running the code inside the curly braces.';
        arcadeAnalogy = 'A locked door checking if you have the key before letting you through.';
      } else if (trimmed.startsWith('for')) {
        explanation = 'A loop that repeats its inner block of code multiple times until the finish condition is met.';
        arcadeAnalogy = 'A timer round where your hero attacks repeatedly until the boss counter hits zero.';
      }

      return {
        codeSnippet: trimmed,
        explanation,
        arcadeAnalogy,
      };
    });

    return {
      summary: `Your script for "${lessonTitle}" sets up instructions for the JavaScript engine to evaluate sequentially from top to bottom.`,
      breakdown: breakdown.length > 0 ? breakdown : [
        {
          codeSnippet: userCode.slice(0, 40),
          explanation: 'Initializes your custom code instructions.',
          arcadeAnalogy: 'Loading coin into the arcade slot.',
        },
      ],
      mentalModel: 'JavaScript reads your instructions like a culinary recipe: top-to-bottom, storing ingredients in memory and printing results on command.',
      keyTakeaway: 'Always verify that variables are declared before they are used, and match your opening brackets { with closing brackets }!',
    };
  }

  /**
   * Generates code review and error diagnosis
   */
  public static reviewCode(request: ReviewRequest): ReviewResponse {
    const { lessonTitle, userCode, testResults, errorMessage } = request;

    const failedTests = testResults?.filter(t => !t.passed) || [];
    const allPassed = testResults && testResults.length > 0 && failedTests.length === 0 && !errorMessage;

    if (allPassed) {
      return {
        overallStatus: 'ready_to_clear',
        praise: `Outstanding execution on "${lessonTitle}", Adventurer! Your code cleanly satisfies all quest requirements and assertions.`,
        issues: [],
        encouragingClosing: 'Smash that "Submit & Claim XP" button to bank your rewards and unlock the next level!',
      };
    }

    const issues: ReviewResponse['issues'] = [];

    if (errorMessage) {
      let friendlyDescription = errorMessage;
      let lineHint: string | undefined;

      if (errorMessage.includes('ReferenceError')) {
        friendlyDescription = 'You used a name or variable that the computer does not recognize. Did you forget `let` or misspell it?';
      } else if (errorMessage.includes('SyntaxError')) {
        friendlyDescription = 'There is a syntax roadblock—check for missing quotation marks, mismatched parentheses, or missing semicolons.';
      } else if (errorMessage.includes('TypeError')) {
        friendlyDescription = 'You tried to perform an action on a value that does not support it (e.g. treating undefined like a function or object).';
      }

      issues.push({
        severity: 'error',
        description: friendlyDescription,
        lineHint,
        suggestedInvestigation: 'Trace each line where variables are introduced and check for exact spelling and matching quotes.',
      });
    }

    for (const test of failedTests) {
      issues.push({
        severity: 'warning',
        description: `Quest Requirement Not Met: "${test.name}"`,
        suggestedInvestigation: test.expected
          ? `Expected output: "${test.expected}", but received: "${test.actual ?? 'undefined'}". Notice any small formatting differences?`
          : 'Check if your function returns the required value or if your console prints the required message.',
      });
    }

    if (issues.length === 0 && !userCode.trim()) {
      issues.push({
        severity: 'info',
        description: 'Your editor is currently empty!',
        suggestedInvestigation: 'Read the quest objectives on the left panel and type your first line of code.',
      });
    }

    return {
      overallStatus: issues.some(i => i.severity === 'error') ? 'stuck' : 'needs_tweak',
      praise: 'Great grit! You have loaded your script and tested your logic against the arcade engine.',
      issues,
      encouragingClosing: 'Every great programmer encounters bugs—they are just puzzles waiting for your solution. You got this!',
    };
  }

  /**
   * Responds to free-form student queries
   */
  public static chat(request: ChatRequest): ChatResponse {
    const { userMessage, userCode } = request;
    const query = userMessage.toLowerCase();

    const hasCodeInEditor = Boolean(userCode.trim());
    let reply = hasCodeInEditor
      ? `That is an awesome question, Adventurer! In programming, breaking problems down into small experiments is the fastest way to learn. Let's look at your current code in the editor!`
      : `That is an awesome question, Adventurer! Type a line of code into your editor and let's test it out together!`;

    const quickPrompts = [
      'Can you give me a Level 1 Hint?',
      'Explain my code line-by-line',
      'What does this error mean?',
    ];
    let mood: ChatResponse['mood'] = 'supportive';

    if (query.includes('answer') || query.includes('give me code') || query.includes('solve this') || query.includes('just tell me')) {
      reply = `As your CodeArcade AI Tutor, I promised not to spoil the fun by handing you the direct answer! 🎮 If I type the code for you, your brain doesn't get the XP boost. Instead, click the "Level 1 Hint" button, or tell me which specific line is confusing you!`;
      mood = 'brainstorming';
      quickPrompts.splice(0, 1, 'Give me a subtle hint', 'Explain what I did wrong');
    } else if (query.includes('let') || query.includes('const') || query.includes('var')) {
      reply = `Great curiosity! Think of \`const\` as a locked safe 🔒 (its value cannot be reassigned once created). Use \`let\` when you want an open backpack slot 🎒 whose contents can change as your hero levels up! Avoid old \`var\` in modern JavaScript.`;
      mood = 'supportive';
      quickPrompts.push('When should I use let vs const?', 'Show me an example of let');
    } else if (query.includes('function')) {
      reply = `A function is like a recorded macro or spell combo ⚡. You bundle up a series of commands with a name like \`castFireball()\`. Whenever you call that name, all those commands trigger in sequence!`;
      mood = 'curious';
      quickPrompts.push('What is a return statement?', 'How do function arguments work?');
    } else if (query.includes('array')) {
      reply = `An array is an ordered party roster! 🛡️ In JavaScript, arrays use square brackets \`["Hero", "Mage", "Healer"]\`. The trickiest part for beginners: we count starting from 0, so roster[0] is the Hero!`;
      mood = 'curious';
      quickPrompts.push('What is .length in an array?', 'How do I add an item with push?');
    } else if (query.includes('error') || query.includes('bug') || query.includes('broken')) {
      reply = `Don't panic! Bugs are just boss puzzles waiting to be solved 👾. Click the "Review & Diagnose" button above, and I will analyze your error and pinpoint where the hiccup is!`;
      mood = 'supportive';
      quickPrompts.push('Run Code Review', 'Why is my test failing?');
    } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      reply = `Hey there, Adventurer! 👋 I am Pixel, your AI companion in CodeArcade. I am monitoring your code in real-time. Ask me anything about syntax, logic, or request a nudge whenever you feel stuck!`;
      mood = 'celebratory';
    }

    return {
      message: reply,
      quickPrompts: quickPrompts.slice(0, 3),
      mood,
    };
  }
}
