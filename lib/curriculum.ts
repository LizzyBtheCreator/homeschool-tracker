export type Subject = 'math' | 'ela' | 'science' | 'history' | 'writing'

export const SUBJECTS: { key: Subject; label: string; emoji: string }[] = [
  { key: 'math',    label: 'Math',           emoji: '🔢' },
  { key: 'ela',     label: 'Reading & ELA',  emoji: '📚' },
  { key: 'science', label: 'Science',        emoji: '🔬' },
  { key: 'history', label: 'History',        emoji: '🌍' },
  { key: 'writing', label: 'Writing',        emoji: '✏️' },
]

export const GRADE_LEVELS = [4, 5, 6, 7, 8]

// ─── QUESTION TYPES ────────────────────────────────────────────────────────

export interface MultipleChoiceQuestion {
  type: 'multiple-choice'
  id: string
  grade: number
  question: string
  options: string[]
  answer: number
  explanation: string
}

export interface FillBlankQuestion {
  type: 'fill-blank'
  id: string
  grade: number
  question: string      // e.g. "What is 7 × 8?"
  answer: string        // exact string match (case-insensitive, trimmed)
  hint?: string
  explanation: string
}

export interface StepQuestion {
  type: 'step-by-step'
  id: string
  grade: number
  problem: string       // e.g. "Let's work through 34 × 7 together."
  steps: {
    instruction: string // what to do / think about at this step
    prompt: string      // "7 × 4 = ?"
    answer: string      // "28"
    carry?: string      // e.g. "Write down 8, carry the 2"
    explanation: string
  }[]
  finalAnswer: string
}

export type PracticeQuestion = MultipleChoiceQuestion | FillBlankQuestion | StepQuestion

// Legacy type alias for placement quiz (always multiple-choice)
export interface QuizQuestion {
  id: string
  grade: number
  question: string
  options: string[]
  answer: number
  explanation: string
}

// ─── PLACEMENT QUIZ ────────────────────────────────────────────────────────

export const PLACEMENT_QUESTIONS: Record<Subject, QuizQuestion[]> = {
  math: [
    { id: 'm4-1', grade: 4, question: 'What is 346 × 7?', options: ['2,422', '2,322', '2,142', '2,522'], answer: 0, explanation: '346 × 7 = 2,422' },
    { id: 'm4-2', grade: 4, question: 'Which fraction is equivalent to 2/4?', options: ['1/2', '1/3', '3/4', '2/3'], answer: 0, explanation: '2/4 simplifies to 1/2' },
    { id: 'm4-3', grade: 4, question: 'What is the area of a rectangle 8 cm wide and 5 cm tall?', options: ['40 cm²', '26 cm²', '13 cm²', '45 cm²'], answer: 0, explanation: 'Area = length × width = 8 × 5 = 40 cm²' },
    { id: 'm5-1', grade: 5, question: 'What is 4.5 + 3.75?', options: ['8.25', '7.75', '8.05', '7.25'], answer: 0, explanation: '4.5 + 3.75 = 8.25' },
    { id: 'm5-2', grade: 5, question: 'What is 3/4 of 24?', options: ['18', '16', '20', '12'], answer: 0, explanation: '24 ÷ 4 × 3 = 18' },
    { id: 'm5-3', grade: 5, question: 'What is the volume of a box 3 ft × 4 ft × 2 ft?', options: ['24 ft³', '26 ft³', '18 ft³', '20 ft³'], answer: 0, explanation: 'Volume = 3 × 4 × 2 = 24 ft³' },
    { id: 'm6-1', grade: 6, question: 'Simplify: 18/24', options: ['3/4', '2/3', '5/6', '4/5'], answer: 0, explanation: 'GCF of 18 and 24 is 6. 18÷6 / 24÷6 = 3/4' },
    { id: 'm6-2', grade: 6, question: 'What is 15% of 80?', options: ['12', '10', '15', '8'], answer: 0, explanation: '80 × 0.15 = 12' },
    { id: 'm6-3', grade: 6, question: 'Solve: x + 7 = 15', options: ['x = 8', 'x = 22', 'x = 7', 'x = 9'], answer: 0, explanation: 'Subtract 7 from both sides: x = 15 − 7 = 8' },
    { id: 'm7-1', grade: 7, question: 'Solve: 3x − 5 = 16', options: ['x = 7', 'x = 5', 'x = 8', 'x = 11'], answer: 0, explanation: '3x = 21, x = 7' },
    { id: 'm7-2', grade: 7, question: 'What is −4 × −6?', options: ['24', '−24', '10', '−10'], answer: 0, explanation: 'Negative × negative = positive. −4 × −6 = 24' },
    { id: 'm7-3', grade: 7, question: 'A shirt costs $24 after a 20% discount. What was the original price?', options: ['$30', '$28', '$32', '$26'], answer: 0, explanation: 'If 80% = $24, then 100% = $24 ÷ 0.8 = $30' },
    { id: 'm8-1', grade: 8, question: 'Solve: 2x² = 50', options: ['x = 5 or x = −5', 'x = 25', 'x = 5', 'x = 10'], answer: 0, explanation: 'x² = 25, so x = ±5' },
    { id: 'm8-2', grade: 8, question: 'What is the slope of a line through (2,3) and (6,11)?', options: ['2', '4', '1/2', '3'], answer: 0, explanation: 'Slope = (11−3)/(6−2) = 8/4 = 2' },
    { id: 'm8-3', grade: 8, question: 'What is √144?', options: ['12', '14', '11', '13'], answer: 0, explanation: '12 × 12 = 144' },
    { id: 'm9-1', grade: 9, question: 'Factor: x² + 5x + 6', options: ['(x + 2)(x + 3)', '(x + 1)(x + 6)', '(x − 2)(x − 3)', '(x + 2)(x − 3)'], answer: 0, explanation: 'Find two numbers that multiply to 6 and add to 5: 2 and 3. So (x+2)(x+3).' },
    { id: 'm9-2', grade: 9, question: 'What is the y-intercept of y = 3x − 7?', options: ['−7', '3', '7', '−3'], answer: 0, explanation: 'In y = mx + b, b is the y-intercept. Here b = −7.' },
    { id: 'm9-3', grade: 9, question: 'Solve the system: x + y = 10, x − y = 4', options: ['x = 7, y = 3', 'x = 6, y = 4', 'x = 5, y = 5', 'x = 8, y = 2'], answer: 0, explanation: 'Add the equations: 2x = 14, x = 7. Then y = 10 − 7 = 3.' },
    { id: 'm10-1', grade: 10, question: 'In a right triangle, sin(30°) = ?', options: ['1/2', '√3/2', '√2/2', '1'], answer: 0, explanation: 'sin(30°) = 1/2 is a standard trigonometric value to memorize.' },
    { id: 'm10-2', grade: 10, question: 'What is the area of a circle with radius 5?', options: ['25π', '10π', '5π', '50π'], answer: 0, explanation: 'Area = πr² = π(5²) = 25π' },
    { id: 'm10-3', grade: 10, question: 'Simplify: (x³)(x⁴)', options: ['x⁷', 'x¹²', 'x', 'x³⁴'], answer: 0, explanation: 'When multiplying same bases, add exponents: x³ · x⁴ = x⁷.' },
    { id: 'm11-1', grade: 11, question: 'What is the derivative of f(x) = x³?', options: ['3x²', 'x²', '3x³', '3'], answer: 0, explanation: 'Power rule: bring down the exponent, reduce it by 1. d/dx(x³) = 3x².' },
    { id: 'm11-2', grade: 11, question: 'log₂(8) = ?', options: ['3', '4', '2', '8'], answer: 0, explanation: '2³ = 8, so log₂(8) = 3.' },
    { id: 'm11-3', grade: 11, question: 'What is the sum of the first 5 terms of the geometric series 2, 4, 8, 16, 32?', options: ['62', '60', '64', '58'], answer: 0, explanation: '2 + 4 + 8 + 16 + 32 = 62.' },
    { id: 'm12-1', grade: 12, question: 'What is ∫2x dx?', options: ['x² + C', '2x² + C', 'x + C', '2 + C'], answer: 0, explanation: '∫2x dx = x² + C by the power rule for integration.' },
    { id: 'm12-2', grade: 12, question: 'What does lim(x→∞) 1/x equal?', options: ['0', '1', 'infinity', 'undefined'], answer: 0, explanation: 'As x grows infinitely large, 1/x approaches 0.' },
    { id: 'm12-3', grade: 12, question: 'In statistics, what does a p-value less than 0.05 typically indicate?', options: ['The result is statistically significant', 'The null hypothesis is true', 'There is no effect', 'The sample size is too small'], answer: 0, explanation: 'A p-value < 0.05 means results are unlikely due to chance — statistically significant.' },
  ],
  ela: [
    { id: 'e4-1', grade: 4, question: 'Which sentence uses a comma correctly?', options: ['I like cats, dogs, and fish.', 'I like, cats dogs and fish.', 'I like cats dogs, and fish.', 'I, like cats dogs and fish.'], answer: 0, explanation: 'Use commas to separate items in a list.' },
    { id: 'e4-2', grade: 4, question: 'What does "exhausted" mean?', options: ['Very tired', 'Very happy', 'Very angry', 'Very hungry'], answer: 0, explanation: 'Exhausted means extremely tired.' },
    { id: 'e5-1', grade: 5, question: 'What is the main idea of a paragraph?', options: ['The most important point the paragraph makes', 'The first sentence', 'A detail that supports the topic', 'The last sentence'], answer: 0, explanation: 'The main idea is the central point or message of a paragraph.' },
    { id: 'e5-2', grade: 5, question: 'Which word is a synonym for "enormous"?', options: ['Gigantic', 'Tiny', 'Average', 'Narrow'], answer: 0, explanation: 'Enormous and gigantic both mean very large.' },
    { id: 'e6-1', grade: 6, question: 'What literary device is used in: "The wind whispered through the trees"?', options: ['Personification', 'Simile', 'Metaphor', 'Alliteration'], answer: 0, explanation: 'Personification gives human qualities (whispering) to non-human things (wind).' },
    { id: 'e6-2', grade: 6, question: 'What is the purpose of a thesis statement?', options: ['To state the main argument of an essay', 'To conclude an essay', 'To list supporting details', 'To introduce a quote'], answer: 0, explanation: 'A thesis statement presents the central claim or argument of an essay.' },
    { id: 'e7-1', grade: 7, question: 'What is an inference?', options: ['A conclusion drawn from evidence and reasoning', 'A direct quote from the text', 'The author\'s biography', 'The setting of a story'], answer: 0, explanation: 'An inference is a logical conclusion based on clues in the text.' },
    { id: 'e7-2', grade: 7, question: 'Which sentence is in passive voice?', options: ['The cake was eaten by the dog.', 'The dog ate the cake.', 'The dog is eating cake.', 'The dog will eat cake.'], answer: 0, explanation: 'Passive voice: the subject receives the action.' },
    { id: 'e8-1', grade: 8, question: 'What does "ambiguous" mean?', options: ['Open to more than one interpretation', 'Perfectly clear', 'Extremely rare', 'Strongly opposed'], answer: 0, explanation: 'Ambiguous means having more than one possible meaning.' },
    { id: 'e8-2', grade: 8, question: 'In an argument, what is a "counterclaim"?', options: ['An opposing viewpoint the writer addresses', 'The writer\'s main argument', 'Evidence that supports the claim', 'The conclusion of an essay'], answer: 0, explanation: 'A counterclaim is the opposing side\'s argument.' },
    { id: 'e9-1', grade: 9, question: 'What is the effect of an author\'s tone on a text?', options: ['It reveals the author\'s attitude and shapes how readers feel', 'It only affects the plot', 'It determines the length of the text', 'It has no effect on meaning'], answer: 0, explanation: 'Tone reflects the author\'s attitude and influences the reader\'s emotional response.' },
    { id: 'e9-2', grade: 9, question: 'What is dramatic irony?', options: ['When the audience knows something a character does not', 'When events turn out opposite to what was expected', 'When a character says the opposite of what they mean', 'When two characters misunderstand each other'], answer: 0, explanation: 'Dramatic irony occurs when the audience has information the character lacks, creating tension.' },
    { id: 'e10-1', grade: 10, question: 'What is the purpose of a rhetorical question?', options: ['To make a point or provoke thought, not to get a literal answer', 'To request information from the reader', 'To introduce a new argument', 'To summarize a paragraph'], answer: 0, explanation: 'Rhetorical questions engage the reader and emphasize a point without expecting a reply.' },
    { id: 'e10-2', grade: 10, question: 'In Shakespeare\'s Romeo and Juliet, what literary device is "What light through yonder window breaks? It is the East, and Juliet is the sun"?', options: ['Metaphor', 'Simile', 'Personification', 'Hyperbole'], answer: 0, explanation: 'Romeo compares Juliet directly to the sun without using "like" or "as" — that\'s a metaphor.' },
    { id: 'e11-1', grade: 11, question: 'What is the difference between a primary and secondary source?', options: ['Primary sources are firsthand accounts; secondary sources analyze or interpret them', 'Primary sources are more reliable', 'Secondary sources are older', 'There is no meaningful difference'], answer: 0, explanation: 'Primary sources are original materials (diaries, speeches, data). Secondary sources interpret primary ones.' },
    { id: 'e11-2', grade: 11, question: 'What does "syntax" mean in the study of language?', options: ['The arrangement of words and phrases to create sentences', 'The meaning of words', 'The history of a word\'s origin', 'The sound patterns in poetry'], answer: 0, explanation: 'Syntax refers to how words are arranged into sentences and grammatical structures.' },
    { id: 'e12-1', grade: 12, question: 'What is a "synthesis" essay?', options: ['An essay that combines multiple sources to support an argument', 'A summary of one text', 'A personal narrative', 'A comparison of two books'], answer: 0, explanation: 'A synthesis essay pulls from multiple sources and integrates them to build a cohesive argument — a core college writing skill.' },
    { id: 'e12-2', grade: 12, question: 'What is the difference between deductive and inductive reasoning?', options: ['Deductive moves from general to specific; inductive moves from specific to general', 'They are the same process', 'Inductive reasoning uses rules; deductive uses examples', 'Deductive is used only in science'], answer: 0, explanation: 'Deductive: starts with a general rule and applies it. Inductive: starts with observations and draws a general conclusion.' },
  ],
  science: [
    { id: 's4-1', grade: 4, question: 'What do plants need to make their own food?', options: ['Sunlight, water, and carbon dioxide', 'Sunlight, soil, and oxygen', 'Water, oxygen, and minerals', 'Carbon dioxide, soil, and nutrients'], answer: 0, explanation: 'Photosynthesis uses sunlight, water, and CO₂.' },
    { id: 's5-1', grade: 5, question: 'What are the three states of matter?', options: ['Solid, liquid, gas', 'Hot, warm, cold', 'Earth, water, air', 'Metal, wood, plastic'], answer: 0, explanation: 'The three common states of matter are solid, liquid, and gas.' },
    { id: 's6-1', grade: 6, question: 'What is the difference between a physical and chemical change?', options: ['Physical changes don\'t create new substances; chemical changes do', 'Physical changes are permanent; chemical are temporary', 'Chemical changes are faster', 'There is no real difference'], answer: 0, explanation: 'A physical change alters form but not substance. A chemical change creates new substances.' },
    { id: 's6-2', grade: 6, question: 'What planet is closest to the Sun?', options: ['Mercury', 'Venus', 'Earth', 'Mars'], answer: 0, explanation: 'Mercury is the closest planet to the Sun.' },
    { id: 's7-1', grade: 7, question: 'What is the function of the mitochondria?', options: ['Produce energy (ATP) for the cell', 'Control cell reproduction', 'Store genetic information', 'Protect the cell'], answer: 0, explanation: 'Mitochondria are the powerhouse of the cell.' },
    { id: 's7-2', grade: 7, question: 'What force pulls objects toward Earth?', options: ['Gravity', 'Magnetism', 'Friction', 'Inertia'], answer: 0, explanation: 'Gravity is the force of attraction between masses.' },
    { id: 's8-1', grade: 8, question: 'What is Newton\'s First Law of Motion?', options: ['An object at rest stays at rest unless acted on by a force', 'Force equals mass times acceleration', 'Every action has an equal and opposite reaction', 'Objects fall at the same rate regardless of mass'], answer: 0, explanation: 'Newton\'s First Law is the law of inertia.' },
    { id: 's8-2', grade: 8, question: 'What carries genetic information in a cell?', options: ['DNA', 'RNA', 'Protein', 'Glucose'], answer: 0, explanation: 'DNA contains the genetic instructions for all living things.' },
    { id: 's9-1', grade: 9, question: 'What is the difference between an atom and a molecule?', options: ['An atom is a single element; a molecule is two or more atoms bonded together', 'They are the same thing', 'A molecule is smaller than an atom', 'Atoms only exist in gases'], answer: 0, explanation: 'Atoms are the basic units of elements. Molecules form when two or more atoms bond (e.g., H₂O).' },
    { id: 's9-2', grade: 9, question: 'What is a covalent bond?', options: ['A bond where two atoms share electrons', 'A bond where one atom transfers electrons to another', 'A bond between oppositely charged ions', 'A weak attraction between molecules'], answer: 0, explanation: 'Covalent bonds involve sharing electrons between atoms, common in organic compounds.' },
    { id: 's10-1', grade: 10, question: 'What is the process by which cells divide to produce exact copies?', options: ['Mitosis', 'Meiosis', 'Osmosis', 'Photosynthesis'], answer: 0, explanation: 'Mitosis produces two identical daughter cells — used for growth and repair.' },
    { id: 's10-2', grade: 10, question: 'What does the law of conservation of energy state?', options: ['Energy cannot be created or destroyed, only transformed', 'Energy always increases over time', 'Heat is the only form of energy', 'Energy is destroyed when used'], answer: 0, explanation: 'Energy is conserved — it changes form but the total amount stays the same.' },
    { id: 's11-1', grade: 11, question: 'What is natural selection?', options: ['The process where organisms with favorable traits survive and reproduce more', 'Random changes in DNA', 'The artificial breeding of animals', 'The extinction of weak species'], answer: 0, explanation: 'Natural selection is Darwin\'s mechanism of evolution — favorable traits become more common over generations.' },
    { id: 's11-2', grade: 11, question: 'In chemistry, what is a mole?', options: ['6.022 × 10²³ particles of a substance', 'A unit of temperature', 'The mass of one atom', 'A type of chemical bond'], answer: 0, explanation: 'A mole is Avogadro\'s number (6.022 × 10²³) — used to count atoms and molecules.' },
    { id: 's12-1', grade: 12, question: 'What is the difference between velocity and speed?', options: ['Velocity includes direction; speed does not', 'Speed includes direction; velocity does not', 'They are identical', 'Velocity is always greater than speed'], answer: 0, explanation: 'Speed is a scalar (magnitude only). Velocity is a vector (magnitude + direction).' },
    { id: 's12-2', grade: 12, question: 'What does entropy measure in thermodynamics?', options: ['The degree of disorder or randomness in a system', 'The total energy of a system', 'The temperature of a reaction', 'The speed of molecules'], answer: 0, explanation: 'Entropy measures disorder. The Second Law of Thermodynamics says entropy in a closed system tends to increase.' },
  ],
  history: [
    { id: 'h4-1', grade: 4, question: 'Who was the first President of the United States?', options: ['George Washington', 'Thomas Jefferson', 'John Adams', 'Benjamin Franklin'], answer: 0, explanation: 'George Washington became the first U.S. President in 1789.' },
    { id: 'h5-1', grade: 5, question: 'What document declared American independence from Britain?', options: ['The Declaration of Independence', 'The Constitution', 'The Bill of Rights', 'The Mayflower Compact'], answer: 0, explanation: 'The Declaration of Independence was signed in 1776.' },
    { id: 'h6-1', grade: 6, question: 'Which ancient civilization built the pyramids at Giza?', options: ['Ancient Egyptians', 'Ancient Greeks', 'Ancient Romans', 'Mesopotamians'], answer: 0, explanation: 'The Great Pyramids were built by ancient Egyptians around 2500 BCE.' },
    { id: 'h6-2', grade: 6, question: 'What was the Silk Road?', options: ['A trade network connecting Asia, Africa, and Europe', 'A road built by the Romans', 'A Chinese royal highway', 'A route used only for silk trade in China'], answer: 0, explanation: 'The Silk Road was a vast network of trade routes.' },
    { id: 'h7-1', grade: 7, question: 'What was the main cause of the American Civil War?', options: ['Slavery and states\' rights', 'A dispute over land with Britain', 'Economic competition with France', 'Religious differences between states'], answer: 0, explanation: 'The Civil War was primarily fought over slavery and states\' rights.' },
    { id: 'h7-2', grade: 7, question: 'What event sparked World War I?', options: ['The assassination of Archduke Franz Ferdinand', 'Germany invaded Poland', 'The bombing of Pearl Harbor', 'The sinking of the Lusitania'], answer: 0, explanation: 'WWI began after Archduke Franz Ferdinand was assassinated in 1914.' },
    { id: 'h8-1', grade: 8, question: 'What was the Cold War?', options: ['A political and ideological conflict between the US and USSR', 'A war fought in the Arctic', 'A period of economic depression', 'A conflict over water rights'], answer: 0, explanation: 'The Cold War (1947–1991) was a standoff between the US and USSR.' },
    { id: 'h8-2', grade: 8, question: 'What was the significance of the Emancipation Proclamation?', options: ['It declared enslaved people in Confederate states to be free', 'It ended the Civil War', 'It gave women the right to vote', 'It established the 13th Amendment'], answer: 0, explanation: 'Issued in 1863 by Lincoln, it declared enslaved people in rebelling states free.' },
    { id: 'h9-1', grade: 9, question: 'What was the Renaissance?', options: ['A European cultural rebirth of art, science, and learning (14th–17th century)', 'A period of religious wars in the Middle East', 'The fall of the Roman Empire', 'A trade agreement between European nations'], answer: 0, explanation: 'The Renaissance ("rebirth") was a flourishing of art, science, and humanism beginning in Italy.' },
    { id: 'h9-2', grade: 9, question: 'What caused World War II?', options: ['German aggression, nationalism, failure of appeasement, and global depression', 'The assassination of a world leader', 'A trade dispute between the US and Japan', 'A nuclear weapons race'], answer: 0, explanation: 'WWII resulted from Hitler\'s expansionism, the failure of the Treaty of Versailles, global depression, and failed appeasement policies.' },
    { id: 'h10-1', grade: 10, question: 'What was the significance of the Magna Carta (1215)?', options: ['It established that the king was subject to the rule of law', 'It abolished the monarchy in England', 'It created the first democratic election', 'It ended serfdom in Europe'], answer: 0, explanation: 'The Magna Carta limited royal power and established that even kings must follow the law — a foundation of constitutional government.' },
    { id: 'h10-2', grade: 10, question: 'What was the Industrial Revolution?', options: ['A shift from agricultural to industrial economies, beginning in Britain (~1760)', 'A political revolution in France', 'A period of scientific discovery in America', 'A trade agreement between industrial nations'], answer: 0, explanation: 'The Industrial Revolution transformed economies through factories, machines, and mass production, starting in Britain.' },
    { id: 'h11-1', grade: 11, question: 'What was the significance of the Civil Rights Act of 1964?', options: ['It outlawed discrimination based on race, color, religion, sex, or national origin', 'It gave African Americans the right to vote', 'It ended segregation in schools only', 'It created the NAACP'], answer: 0, explanation: 'The Civil Rights Act of 1964 was landmark legislation banning discrimination in employment and public accommodations.' },
    { id: 'h11-2', grade: 11, question: 'What was the Marshall Plan?', options: ['A US program providing economic aid to rebuild Western Europe after WWII', 'A military alliance against the Soviet Union', 'A peace treaty ending WWII', 'A plan to rebuild Japan after the atomic bombs'], answer: 0, explanation: 'The Marshall Plan (1948) provided $13 billion in US aid to help rebuild Western European economies after WWII.' },
    { id: 'h12-1', grade: 12, question: 'What is the significance of Marbury v. Madison (1803)?', options: ['It established judicial review — the Supreme Court\'s power to strike down unconstitutional laws', 'It ended slavery in the US', 'It established freedom of the press', 'It created the federal court system'], answer: 0, explanation: 'Marbury v. Madison established judicial review, giving the Supreme Court power to declare laws unconstitutional.' },
    { id: 'h12-2', grade: 12, question: 'What was the policy of containment in the Cold War?', options: ['The US strategy of preventing the spread of Soviet communism', 'A policy of direct military conflict with the USSR', 'An agreement to divide Europe permanently', 'A trade policy restricting Soviet imports'], answer: 0, explanation: 'Containment (Truman Doctrine) was the US strategy of preventing Soviet communism from spreading beyond its existing borders.' },
  ],
  writing: [
    { id: 'w4-1', grade: 4, question: 'What are the three main parts of an essay?', options: ['Introduction, body, conclusion', 'Topic, details, summary', 'Title, paragraphs, ending', 'Hook, facts, opinion'], answer: 0, explanation: 'Every essay has an introduction, body paragraphs, and a conclusion.' },
    { id: 'w5-1', grade: 5, question: 'What is a topic sentence?', options: ['The sentence that states the main idea of a paragraph', 'The first sentence of an essay', 'A sentence that provides evidence', 'The last sentence of a paragraph'], answer: 0, explanation: 'A topic sentence introduces the main idea of its paragraph.' },
    { id: 'w6-1', grade: 6, question: 'Which transition word shows contrast?', options: ['However', 'Furthermore', 'Therefore', 'Similarly'], answer: 0, explanation: '"However" signals a contrast or shift in idea.' },
    { id: 'w6-2', grade: 6, question: 'What is the purpose of a concluding sentence?', options: ['To wrap up the paragraph\'s main idea', 'To introduce a new topic', 'To provide more evidence', 'To quote a source'], answer: 0, explanation: 'A concluding sentence summarizes the paragraph and signals the end of that idea.' },
    { id: 'w7-1', grade: 7, question: 'What does "elaboration" mean in writing?', options: ['Expanding on an idea with details, examples, or explanation', 'Shortening your writing', 'Copying a quote', 'Writing a new paragraph'], answer: 0, explanation: 'Elaboration means developing an idea more fully.' },
    { id: 'w7-2', grade: 7, question: 'Which sentence is most specific and vivid?', options: ['The old dog limped slowly across the cracked sidewalk.', 'The dog walked outside.', 'A dog went somewhere.', 'There was a dog.'], answer: 0, explanation: 'Specific details make writing more vivid and engaging.' },
    { id: 'w8-1', grade: 8, question: 'What is the difference between persuasive and expository writing?', options: ['Persuasive argues a position; expository explains or informs', 'Expository uses emotions; persuasive uses facts', 'They are the same', 'Persuasive is longer than expository'], answer: 0, explanation: 'Persuasive writing aims to convince. Expository writing aims to inform or explain.' },
    { id: 'w8-2', grade: 8, question: 'What should you do when revising a draft?', options: ['Improve clarity, organization, and content — not just fix spelling', 'Only correct grammar mistakes', 'Add more sentences', 'Remove the introduction'], answer: 0, explanation: 'Revision means improving ideas, structure, and clarity, not just proofreading.' },
    { id: 'w9-1', grade: 9, question: 'What makes evidence "credible" in an argument?', options: ['It comes from reliable, expert, or verifiable sources', 'It agrees with your opinion', 'It is the most recent information available', 'It is the longest piece of evidence'], answer: 0, explanation: 'Credible evidence comes from trustworthy sources — experts, peer-reviewed research, verifiable data.' },
    { id: 'w9-2', grade: 9, question: 'What is the purpose of a hook in an introduction?', options: ['To grab the reader\'s attention immediately', 'To state the thesis', 'To summarize the essay', 'To introduce the first body paragraph'], answer: 0, explanation: 'A hook draws the reader in at the very start — through a question, statistic, quote, or bold statement.' },
    { id: 'w10-1', grade: 10, question: 'What is the difference between quoting and paraphrasing?', options: ['Quoting uses exact words in quotation marks; paraphrasing restates ideas in your own words', 'They mean the same thing', 'Paraphrasing always changes the meaning', 'Quoting requires longer passages'], answer: 0, explanation: 'Quoting = exact words with quotation marks. Paraphrasing = same idea in your own words. Both require citation.' },
    { id: 'w10-2', grade: 10, question: 'What is plagiarism?', options: ['Using someone else\'s words or ideas without giving them credit', 'Writing about someone else\'s life', 'Quoting a source incorrectly', 'Writing about a sensitive topic'], answer: 0, explanation: 'Plagiarism is presenting someone else\'s work as your own. It\'s academic dishonesty and must always be avoided.' },
    { id: 'w11-1', grade: 11, question: 'What is an annotated bibliography?', options: ['A list of sources with a brief summary and evaluation of each', 'A list of books you want to read', 'A glossary of terms', 'A footnote at the bottom of a page'], answer: 0, explanation: 'An annotated bibliography includes each source\'s citation plus a short description of its content and relevance.' },
    { id: 'w11-2', grade: 11, question: 'In argumentative writing, what is the difference between a claim and evidence?', options: ['A claim is your assertion; evidence is proof that supports it', 'They are the same', 'Evidence comes first, then the claim', 'A claim is always a quote'], answer: 0, explanation: 'A claim states your position. Evidence (facts, data, examples) proves that your claim is valid.' },
    { id: 'w12-1', grade: 12, question: 'What is a synthesis essay?', options: ['An essay that integrates multiple sources to support a central argument', 'A summary of a single book', 'A personal reflection essay', 'An essay comparing two opposing viewpoints only'], answer: 0, explanation: 'A synthesis essay pulls ideas from multiple sources and weaves them together to support your own argument — a college-level skill.' },
    { id: 'w12-2', grade: 12, question: 'What does MLA, APA, or Chicago style refer to?', options: ['Citation and formatting styles for academic writing', 'Types of essays', 'Grammar rules for formal writing', 'Ways to organize a paragraph'], answer: 0, explanation: 'MLA, APA, and Chicago are standardized formatting and citation styles used in academic writing — colleges require one of these.' },
  ],
}

// ─── LESSONS ───────────────────────────────────────────────────────────────

export interface LessonStep {
  type: 'explain' | 'example' | 'tip' | 'warning'
  heading?: string
  content: string       // plain text / markdown-lite
}

export interface Lesson {
  id: string
  subject: Subject
  grade: number
  lessonNumber: number
  title: string
  intro: string         // short conversational opener
  steps: LessonStep[]  // lesson content broken into chunks
  practice: PracticeQuestion[]
  streakNeeded: number  // how many correct in a row to pass
  paperBased?: boolean  // lesson requires physical writing; parent marks as done
  paperAssignment?: string  // instructions shown to student for the paper activity
}

export const LESSONS: Lesson[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // MATH GRADE 4
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'math-4-1',
    subject: 'math', grade: 4, lessonNumber: 1,
    title: 'Multiplication: Understanding What It Means',
    intro: "Hey Mathias! Before we start multiplying big numbers, let's make sure we totally understand what multiplication actually IS. This one's going to be slow and steady — that's exactly how we want it.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'So what IS multiplication?',
        content: `Multiplication is just a faster way of adding the same number over and over.

That's it. Nothing scary about it.

For example: 3 × 4 means "3 groups of 4" — or adding 4 three times:
4 + 4 + 4 = 12

So 3 × 4 = 12.

We use multiplication because it's WAY faster than writing out a long list of addition when the numbers get big.`
      },
      {
        type: 'example',
        heading: "Let's try one: 5 × 3",
        content: `5 × 3 means "5 groups of 3."

Think of it like this: you have 5 bags, and each bag has 3 apples.
How many apples total?

Count them out: 3 + 3 + 3 + 3 + 3 = 15

So 5 × 3 = 15.

Here's the cool thing — it also works the other way around!
3 × 5 means "3 groups of 5" → 5 + 5 + 5 = 15

Same answer! Multiplication works in any order. That's called the **commutative property** — fancy name, simple idea.`
      },
      {
        type: 'explain',
        heading: 'The parts of a multiplication problem',
        content: `Let's learn the names so we know what we're talking about:

  6 × 4 = 24

• 6 is called a **factor**
• 4 is also called a **factor**
• 24 is called the **product** — that's your answer

So: factor × factor = product

Easy enough, right? You'll hear those words a lot.`
      },
      {
        type: 'example',
        heading: "Let's try: 7 × 8",
        content: `Okay — 7 × 8. This one trips a lot of people up, so let's walk through it slowly.

7 × 8 means 7 groups of 8.

One way to figure it out: start with something you know.
→ You probably know 5 × 8 = 40. That's a good anchor!
→ Then add 2 more groups of 8: 8 + 8 = 16
→ 40 + 16 = 56

So 7 × 8 = 56.

Another way: count up by 8s:
8, 16, 24, 32, 40, 48, 56 ← that's 7 steps

Either way you get 56. Use whatever makes sense to you!`
      },
      {
        type: 'tip',
        heading: '💡 A trick for multiplying by 9',
        content: `Multiplying by 9 is easy once you know the trick:

Multiply by 10, then subtract the number once.

Example: 9 × 6
→ 10 × 6 = 60
→ 60 − 6 = 54
→ 9 × 6 = 54 ✓

Try it: 9 × 7
→ 10 × 7 = 70
→ 70 − 7 = 63
→ 9 × 7 = 63 ✓

Works every single time!`
      },
      {
        type: 'example',
        heading: "One more: 6 × 7",
        content: `6 × 7. Let's work through it carefully.

Method 1 — anchor method:
→ Start with 5 × 7 = 35 (nice and easy)
→ Add one more group of 7: 35 + 7 = 42

Method 2 — count by 7s:
7, 14, 21, 28, 35, 42 ← that's 6 steps

So 6 × 7 = 42.

If you ever forget a multiplication fact, just count up by one of the numbers. It always works — it just takes a little longer.`
      },
    ],
    practice: [
      {
        type: 'multiple-choice',
        id: 'math-4-1-p1', grade: 4,
        question: 'What does 4 × 6 mean?',
        options: ['4 groups of 6', '4 plus 6', '6 minus 4', 'The number 46'],
        answer: 0,
        explanation: 'Multiplication means groups of. 4 × 6 = 4 groups of 6 = 6 + 6 + 6 + 6 = 24.'
      },
      {
        type: 'fill-blank',
        id: 'math-4-1-p2', grade: 4,
        question: 'What is 3 × 7? (Think: 3 groups of 7, or count up by 7 three times)',
        answer: '21',
        hint: 'Count: 7, 14, ___',
        explanation: '7 + 7 + 7 = 21. So 3 × 7 = 21.'
      },
      {
        type: 'fill-blank',
        id: 'math-4-1-p3', grade: 4,
        question: 'What is 9 × 6? (Tip: try 10 × 6 first, then subtract 6)',
        answer: '54',
        hint: '10 × 6 = 60, then 60 − 6 = ?',
        explanation: '10 × 6 = 60, then 60 − 6 = 54. So 9 × 6 = 54.'
      },
      {
        type: 'step-by-step',
        id: 'math-4-1-p4', grade: 4,
        problem: "Let's work through 5 × 8 together, step by step.",
        steps: [
          {
            instruction: "First, think about what 5 × 8 means. It means 5 groups of ___.",
            prompt: "5 × 8 means 5 groups of what number?",
            answer: "8",
            explanation: "5 × 8 means 5 groups of 8. So we'll add 8 five times."
          },
          {
            instruction: "Now let's count up by 8s. Fill in the next number: 8, 16, ___",
            prompt: "8, 16, ___",
            answer: "24",
            explanation: "8 + 8 = 16, then 16 + 8 = 24. Good!"
          },
          {
            instruction: "Keep going! 8, 16, 24, ___",
            prompt: "8, 16, 24, ___",
            answer: "32",
            explanation: "24 + 8 = 32. You're halfway there!"
          },
          {
            instruction: "Last step! 8, 16, 24, 32, ___",
            prompt: "8, 16, 24, 32, ___",
            answer: "40",
            explanation: "32 + 8 = 40. That's 5 groups of 8!"
          },
        ],
        finalAnswer: "40"
      },
      {
        type: 'multiple-choice',
        id: 'math-4-1-p5', grade: 4,
        question: 'What is 7 × 8?',
        options: ['56', '54', '64', '48'],
        answer: 0,
        explanation: 'Count by 8s: 8, 16, 24, 32, 40, 48, 56. That\'s 7 steps, so 7 × 8 = 56.'
      },
      {
        type: 'fill-blank',
        id: 'math-4-1-p6', grade: 4,
        question: 'What is 6 × 9? (Try the trick: 6 × 10 = 60, then subtract 6)',
        answer: '54',
        hint: '6 × 10 = 60, then 60 − 6 = ?',
        explanation: '6 × 10 = 60, minus 6 = 54. So 6 × 9 = 54.'
      },
      {
        type: 'multiple-choice',
        id: 'math-4-1-p7', grade: 4,
        question: 'If 4 × 7 = 28, what is 7 × 4?',
        options: ['28', '47', '21', '32'],
        answer: 0,
        explanation: 'Multiplication works in any order! 4 × 7 = 7 × 4 = 28. That\'s the commutative property.'
      },
      {
        type: 'fill-blank',
        id: 'math-4-1-p8', grade: 4,
        question: 'What is 8 × 8?',
        answer: '64',
        hint: 'Try: 8 × 4 = 32, then double it',
        explanation: '8 × 8 = 64. You can think of it as 8 × 4 = 32, doubled = 64.'
      },
    ]
  },

  {
    id: 'math-4-2',
    subject: 'math', grade: 4, lessonNumber: 2,
    title: 'Multiplying by 10, 100, and 1,000',
    intro: "Great job on the last lesson! Now we're going to learn one of the most useful multiplication shortcuts ever. Multiplying by 10, 100, or 1,000 is actually super easy once you see the pattern.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'Multiplying by 10',
        content: `Here's the rule: when you multiply any whole number by 10, just add a zero to the end.

That's really it.

Examples:
• 6 × 10 = 60
• 14 × 10 = 140
• 325 × 10 = 3,250

Why does this work? Because our number system is based on tens. Every time you move a digit one place to the left, it's worth 10 times more.

When you add that zero, you're pushing all the digits one place to the left — which multiplies everything by 10.`
      },
      {
        type: 'example',
        heading: "Let's try: 47 × 10",
        content: `47 × 10

Step 1: Take the number — 47
Step 2: Add one zero to the end → 470

Done! 47 × 10 = 470

Let's check it makes sense: 47 + 47 + 47 + 47 + 47 + 47 + 47 + 47 + 47 + 47 = 470 ✓
(That's ten 47s added together — and it equals 470. The zero trick works!)`
      },
      {
        type: 'explain',
        heading: 'Multiplying by 100',
        content: `Same idea — but add TWO zeros.

Examples:
• 6 × 100 = 600
• 14 × 100 = 1,400
• 52 × 100 = 5,200

Why two zeros? Because 100 = 10 × 10. You're moving the digits TWO places to the left.`
      },
      {
        type: 'explain',
        heading: 'Multiplying by 1,000',
        content: `You guessed it — add THREE zeros.

Examples:
• 6 × 1,000 = 6,000
• 14 × 1,000 = 14,000
• 52 × 1,000 = 52,000

Quick summary:
× 10 → add 1 zero
× 100 → add 2 zeros
× 1,000 → add 3 zeros`
      },
      {
        type: 'example',
        heading: "Let's try: 83 × 100",
        content: `83 × 100

Step 1: Take the number — 83
Step 2: We're multiplying by 100, so add two zeros → 8,300

83 × 100 = 8,300

Easy, right? The hard part is just remembering how many zeros to add — and that just comes from practice.`
      },
      {
        type: 'tip',
        heading: '💡 How to remember how many zeros to add',
        content: `Just count the zeros in the number you're multiplying by!

10 has 1 zero → add 1 zero
100 has 2 zeros → add 2 zeros
1,000 has 3 zeros → add 3 zeros

So if someone asks 57 × 1,000:
→ 1,000 has 3 zeros
→ Add 3 zeros to 57
→ 57,000 ✓`
      },
    ],
    practice: [
      {
        type: 'fill-blank',
        id: 'math-4-2-p1', grade: 4,
        question: 'What is 9 × 10?',
        answer: '90',
        hint: 'Add one zero to 9',
        explanation: '9 × 10 = 90. Just add one zero!'
      },
      {
        type: 'fill-blank',
        id: 'math-4-2-p2', grade: 4,
        question: 'What is 35 × 10?',
        answer: '350',
        hint: 'Add one zero to 35',
        explanation: '35 × 10 = 350. Add one zero to get 350.'
      },
      {
        type: 'multiple-choice',
        id: 'math-4-2-p3', grade: 4,
        question: 'What is 7 × 100?',
        options: ['700', '70', '7,000', '107'],
        answer: 0,
        explanation: '7 × 100 = 700. Multiply by 100 → add two zeros.'
      },
      {
        type: 'step-by-step',
        id: 'math-4-2-p4', grade: 4,
        problem: "Let's figure out 46 × 1,000 step by step.",
        steps: [
          {
            instruction: "Look at the number we're multiplying by: 1,000. How many zeros does 1,000 have?",
            prompt: "How many zeros are in 1,000?",
            answer: "3",
            explanation: "1,000 has three zeros: 1-0-0-0. So we'll add 3 zeros to our answer."
          },
          {
            instruction: "Our starting number is 46. To multiply by 1,000, we add 3 zeros. What do we get?",
            prompt: "46 with 3 zeros added = ?",
            answer: "46000",
            explanation: "46 with three zeros added is 46,000. So 46 × 1,000 = 46,000."
          },
        ],
        finalAnswer: "46,000"
      },
      {
        type: 'fill-blank',
        id: 'math-4-2-p5', grade: 4,
        question: 'What is 28 × 100?',
        answer: '2800',
        hint: 'Add two zeros to 28',
        explanation: '28 × 100 = 2,800. Add two zeros!'
      },
      {
        type: 'multiple-choice',
        id: 'math-4-2-p6', grade: 4,
        question: 'How many zeros do you add when multiplying by 1,000?',
        options: ['3', '1', '2', '4'],
        answer: 0,
        explanation: '1,000 has 3 zeros, so you add 3 zeros when multiplying by it.'
      },
      {
        type: 'fill-blank',
        id: 'math-4-2-p7', grade: 4,
        question: 'What is 5 × 1,000?',
        answer: '5000',
        hint: 'Add three zeros to 5',
        explanation: '5 × 1,000 = 5,000. Three zeros added!'
      },
      {
        type: 'multiple-choice',
        id: 'math-4-2-p8', grade: 4,
        question: 'Lily has 100 boxes. Each box has 64 crayons. How many crayons total?',
        options: ['6,400', '640', '64,000', '6,040'],
        answer: 0,
        explanation: '64 × 100 = 6,400. Add two zeros to 64.'
      },
    ]
  },

  {
    id: 'math-4-3',
    subject: 'math', grade: 4, lessonNumber: 3,
    title: 'Multiplying a 2-Digit Number by a 1-Digit Number',
    intro: "Now we're going to level up. This is where we start multiplying bigger numbers — like 34 × 7. Don't worry, we'll go through it one tiny step at a time. By the end you'll have it down.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'The idea: break it into parts',
        content: `When we multiply a 2-digit number by a 1-digit number, we break the big number into parts and multiply each part separately.

This is called the **distributive property** — but don't stress about the name.

The idea is simple:
34 × 7 → break 34 into 30 and 4

Then:
• Multiply 7 × 4 = 28
• Multiply 7 × 30 = 210
• Add them together: 28 + 210 = 238

So 34 × 7 = 238.

We'll also learn to do this with a method called "carrying" — which is just a faster way to do the same thing.`
      },
      {
        type: 'example',
        heading: "Step-by-step: 34 × 7 using carrying",
        content: `Let's set it up like this:

    3 4
  ×   7
  -----

Step 1: Multiply 7 × 4 (the ONES digit first — always start on the right)
7 × 4 = 28
→ Write the 8 in the ones place
→ Carry the 2 to the tens column (write a small 2 above the 3)

    ²3 4
  ×    7
  -----
       8

Step 2: Multiply 7 × 3 (the TENS digit)
7 × 3 = 21
→ Now ADD the carried 2: 21 + 2 = 23
→ Write 23

    ²3 4
  ×    7
  -----
    2 3 8

Answer: 34 × 7 = 238 ✓`
      },
      {
        type: 'explain',
        heading: 'Why do we "carry"?',
        content: `Great question. Let's make sure you understand WHY, not just HOW.

When we did 7 × 4 = 28...
• The 8 goes in the ones place (that's the ones digit of 28)
• The 2 actually means 20 — and 20 belongs in the tens column

So we "carry" the 2 into the tens column, where it gets added to whatever else is there.

It's like making change. If you had 28 cents, you'd put 8 pennies in the penny jar and carry 2 dimes over to the dime jar.`
      },
      {
        type: 'example',
        heading: "Let's try another: 56 × 4",
        content: `    5 6
  ×   4
  -----

Step 1: Multiply 4 × 6 (ones digit first)
4 × 6 = 24
→ Write the 4 in the ones place
→ Carry the 2

    ²5 6
  ×   4
  -----
      4

Step 2: Multiply 4 × 5 (tens digit)
4 × 5 = 20
→ Add the carried 2: 20 + 2 = 22
→ Write 22

    ²5 6
  ×   4
  -----
  2 2 4

56 × 4 = 224 ✓

Let's check with our break-apart method:
• 4 × 6 = 24
• 4 × 50 = 200
• 24 + 200 = 224 ✓ Same answer!`
      },
      {
        type: 'example',
        heading: "One more: 78 × 6",
        content: `    7 8
  ×   6
  -----

Step 1: 6 × 8 = 48
→ Write the 8, carry the 4

    ⁴7 8
  ×   6
  -----
      8

Step 2: 6 × 7 = 42
→ Add the carried 4: 42 + 4 = 46
→ Write 46

    ⁴7 8
  ×   6
  -----
  4 6 8

78 × 6 = 468 ✓`
      },
      {
        type: 'tip',
        heading: '💡 The golden rule of multiplication',
        content: `Always start from the RIGHT (the ones digit) and work your way LEFT.

Ones first → Tens second → Hundreds third → and so on.

If you start from the left, carrying gets confusing. Starting from the right keeps everything clean.`
      },
    ],
    practice: [
      {
        type: 'step-by-step',
        id: 'math-4-3-p1', grade: 4,
        problem: "Let's multiply 23 × 4 together, one step at a time.",
        steps: [
          {
            instruction: "Always start with the ONES digit. In 23, the ones digit is 3. Multiply: 4 × 3 = ?",
            prompt: "4 × 3 = ?",
            answer: "12",
            explanation: "4 × 3 = 12. We write the 2 in the ones place and carry the 1."
          },
          {
            instruction: "Now the TENS digit. In 23, the tens digit is 2. Multiply: 4 × 2 = ?",
            prompt: "4 × 2 = ?",
            answer: "8",
            explanation: "4 × 2 = 8. Now add the carried 1: 8 + 1 = 9."
          },
          {
            instruction: "Add the carried 1 to your answer of 8. What do you get?",
            prompt: "8 + 1 = ?",
            answer: "9",
            explanation: "8 + 1 = 9. So our final answer is 92!"
          },
        ],
        finalAnswer: "92"
      },
      {
        type: 'fill-blank',
        id: 'math-4-3-p2', grade: 4,
        question: 'What is 45 × 3? (Start with 3 × 5, then 3 × 4, add any carry)',
        answer: '135',
        hint: '3 × 5 = 15 (write 5, carry 1). Then 3 × 4 = 12, plus 1 = 13.',
        explanation: '3 × 5 = 15 → write 5, carry 1. Then 3 × 4 = 12 + 1 = 13. Answer: 135.'
      },
      {
        type: 'multiple-choice',
        id: 'math-4-3-p3', grade: 4,
        question: 'When multiplying 67 × 5, what is the first step?',
        options: ['Multiply 5 × 7 (the ones digit)', 'Multiply 5 × 6 (the tens digit)', 'Add 67 + 5', 'Multiply 67 × 10'],
        answer: 0,
        explanation: 'Always start with the ONES digit first! 5 × 7 = 35 → write 5, carry 3.'
      },
      {
        type: 'step-by-step',
        id: 'math-4-3-p4', grade: 4,
        problem: "Let's work through 67 × 5 together.",
        steps: [
          {
            instruction: "Start with the ones digit. 5 × 7 = ?",
            prompt: "5 × 7 = ?",
            answer: "35",
            explanation: "5 × 7 = 35. Write the 5, carry the 3."
          },
          {
            instruction: "Now the tens digit. 5 × 6 = ?",
            prompt: "5 × 6 = ?",
            answer: "30",
            explanation: "5 × 6 = 30. Now we need to add the carried 3."
          },
          {
            instruction: "Add the carried 3 to 30.",
            prompt: "30 + 3 = ?",
            answer: "33",
            explanation: "30 + 3 = 33. So the final answer is 335!"
          },
        ],
        finalAnswer: "335"
      },
      {
        type: 'fill-blank',
        id: 'math-4-3-p5', grade: 4,
        question: 'What is 82 × 6?',
        answer: '492',
        hint: '6 × 2 = 12 (write 2, carry 1). 6 × 8 = 48, plus 1 = 49.',
        explanation: '6 × 2 = 12 → write 2, carry 1. 6 × 8 = 48 + 1 = 49. Answer: 492.'
      },
      {
        type: 'multiple-choice',
        id: 'math-4-3-p6', grade: 4,
        question: 'What is 54 × 7?',
        options: ['378', '358', '388', '368'],
        answer: 0,
        explanation: '7 × 4 = 28 → write 8, carry 2. 7 × 5 = 35 + 2 = 37. Answer: 378.'
      },
      {
        type: 'fill-blank',
        id: 'math-4-3-p7', grade: 4,
        question: 'What is 39 × 8?',
        answer: '312',
        hint: '8 × 9 = 72 (write 2, carry 7). 8 × 3 = 24, plus 7 = 31.',
        explanation: '8 × 9 = 72 → write 2, carry 7. 8 × 3 = 24 + 7 = 31. Answer: 312.'
      },
      {
        type: 'multiple-choice',
        id: 'math-4-3-p8', grade: 4,
        question: 'A box has 8 rows of oranges. Each row has 76 oranges. How many oranges total?',
        options: ['608', '508', '618', '598'],
        answer: 0,
        explanation: '76 × 8: 8 × 6 = 48 → write 8, carry 4. 8 × 7 = 56 + 4 = 60. Answer: 608.'
      },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELA GRADE 4
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ela-4-1',
    subject: 'ela', grade: 4, lessonNumber: 1,
    title: 'Reading for Details',
    intro: "Hey! Reading is one of those skills that makes everything else easier — seriously, every subject gets better when you read well. Today we're working on finding details in what you read. Let's dig in.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'What are details?',
        content: `When you read something, there are two levels:
• The **main idea** — the big overall point
• The **details** — the specific facts, examples, and information that support the main idea

Think of it like a tree:
• The trunk = the main idea
• The branches and leaves = the details

Details answer specific questions like:
Who? What? When? Where? Why? How?`
      },
      {
        type: 'example',
        heading: "Read this passage, then we'll find details together",
        content: `*"The blue whale is the largest animal on Earth. It can grow up to 100 feet long and weigh as much as 200 tons — that's heavier than 30 elephants! Blue whales live in every ocean. They eat tiny shrimp-like creatures called krill. A single blue whale can eat up to 4 tons of krill in a single day."*

Let's find the details by asking questions:

**How long can a blue whale grow?** → Up to 100 feet
**How much can it weigh?** → Up to 200 tons
**What does it eat?** → Krill
**How much krill per day?** → Up to 4 tons

See how each answer is a specific fact straight from the passage? That's a detail!`
      },
      {
        type: 'explain',
        heading: 'How to find details when reading',
        content: `Here's a strategy that works every time:

**Step 1:** Read the whole passage once, just to understand it.

**Step 2:** Look at the question you need to answer.

**Step 3:** Go BACK to the passage and look for the specific information. Don't rely on memory — always go back!

**Step 4:** Find the sentence or sentences that answer the question.

**Step 5:** Put the answer in your own words (or copy it directly if it's a specific fact like a number or date).

The most important step? Going BACK to the passage. That's what good readers do.`
      },
      {
        type: 'tip',
        heading: '💡 Watch for signal words',
        content: `Some words signal that an important detail is coming:

• Numbers and dates: "In 1969..." / "over 300..." / "at least 5..."
• Names: "President Lincoln..." / "scientist Marie Curie..."
• Cause words: "because..." / "as a result..." / "due to..."
• Contrast words: "however..." / "but..." / "on the other hand..."

When you see these words, pay extra attention — there's probably an important detail nearby!`
      },
    ],
    practice: [
      {
        type: 'multiple-choice',
        id: 'ela-4-1-p1', grade: 4,
        question: 'Read: "Cheetahs are the fastest land animals. They can run up to 75 miles per hour, but only for short bursts of 20–30 seconds."\n\nWhat is the top speed of a cheetah?',
        options: ['75 miles per hour', '30 miles per hour', '20 miles per hour', '50 miles per hour'],
        answer: 0,
        explanation: 'The passage directly states cheetahs can run "up to 75 miles per hour." That\'s the detail!'
      },
      {
        type: 'fill-blank',
        id: 'ela-4-1-p2', grade: 4,
        question: 'Read: "Mount Everest is the tallest mountain on Earth. It stands 29,032 feet above sea level. It was first climbed in 1953 by Edmund Hillary and Tenzing Norgay."\n\nIn what year was Mount Everest first climbed?',
        answer: '1953',
        hint: 'Look for the year mentioned in the passage.',
        explanation: 'The passage says it "was first climbed in 1953." That\'s the detail you need!'
      },
      {
        type: 'multiple-choice',
        id: 'ela-4-1-p3', grade: 4,
        question: 'Read: "Honeybees live in hives that can contain up to 60,000 bees. The queen bee can lay up to 2,000 eggs per day. Worker bees — all female — do the foraging, cleaning, and building. Male bees are called drones."\n\nWhat are male bees called?',
        options: ['Drones', 'Workers', 'Queens', 'Foragers'],
        answer: 0,
        explanation: 'The passage says "Male bees are called drones." Go back to the text — the answer is always there!'
      },
      {
        type: 'fill-blank',
        id: 'ela-4-1-p4', grade: 4,
        question: 'Using the honeybee passage above: how many eggs can a queen bee lay per day?',
        answer: '2000',
        hint: 'Look for a number near the word "queen" in the passage.',
        explanation: 'The passage says "The queen bee can lay up to 2,000 eggs per day."'
      },
      {
        type: 'multiple-choice',
        id: 'ela-4-1-p5', grade: 4,
        question: 'When looking for a specific detail in a passage, what should you do?',
        options: ['Go back and re-read the passage', 'Only use what you remember', 'Look at the title', 'Skip it and guess'],
        answer: 0,
        explanation: 'Always go back to the text! Details are in the passage — re-reading is not cheating, it\'s smart reading.'
      },
    ]
  },

  {
    id: 'ela-4-2',
    subject: 'ela', grade: 4, lessonNumber: 2,
    title: 'Nouns, Verbs, and Adjectives',
    intro: "Every word in a sentence has a job. Today we're going to learn the three most important word jobs: nouns, verbs, and adjectives. Once you understand these, reading and writing both get a lot easier.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'Nouns — the "things" words',
        content: `A noun is a word that names a person, place, thing, or idea.

**People:** teacher, Mathias, doctor, chef, sister
**Places:** school, ocean, Arizona, bedroom, park
**Things:** pencil, book, car, pizza, skateboard
**Ideas:** freedom, happiness, courage, love, truth

If you can put "the" in front of it, it's probably a noun.
→ "the teacher" ✓ → "the ocean" ✓ → "the happiness" ✓

A noun is usually the WHO or WHAT of a sentence.`
      },
      {
        type: 'explain',
        heading: 'Verbs — the "action" words',
        content: `A verb tells what someone or something DOES, or describes a state of being.

**Action verbs:** run, jump, eat, write, think, laugh, build, fly
**State of being verbs:** is, are, was, were, seems, feels, appears

Every sentence MUST have a verb. It's the engine that makes the sentence go.

Examples:
• The dog **runs** across the yard. (action)
• She **is** happy. (state of being)
• They **were** late. (state of being)
• He **kicked** the ball. (action)`
      },
      {
        type: 'explain',
        heading: 'Adjectives — the "describing" words',
        content: `An adjective describes a noun. It answers questions like:
• What KIND? → a **red** apple, a **scary** movie
• HOW MANY? → **three** dogs, **several** students
• WHICH ONE? → **that** book, **those** shoes

Adjectives usually come RIGHT BEFORE the noun they describe.

Examples:
• The **tall** tree (tall describes tree)
• A **delicious** pizza (delicious describes pizza)
• **Seven** birds (seven describes birds)
• The **old, rusty** car (two adjectives — both describe car)`
      },
      {
        type: 'example',
        heading: "Let's find them all: a sample sentence",
        content: `*"The fierce dragon breathed hot fire over the tiny village."*

Let's identify each part:

**Nouns:** dragon, fire, village
(things — what the sentence is about)

**Verb:** breathed
(what the dragon did — the action)

**Adjectives:** fierce (describes dragon), hot (describes fire), tiny (describes village)

See how each word has a job? Once you train your eye to see these, reading and writing become much clearer.`
      },
    ],
    practice: [
      {
        type: 'multiple-choice',
        id: 'ela-4-2-p1', grade: 4,
        question: '"The brave firefighter rescued the frightened child."\n\nWhich word is a NOUN?',
        options: ['firefighter', 'brave', 'rescued', 'frightened'],
        answer: 0,
        explanation: '"Firefighter" is a person — a noun. "Brave" and "frightened" are adjectives. "Rescued" is a verb.'
      },
      {
        type: 'multiple-choice',
        id: 'ela-4-2-p2', grade: 4,
        question: '"The silver rocket blasted through the dark sky."\n\nWhich word is the VERB?',
        options: ['blasted', 'silver', 'rocket', 'dark'],
        answer: 0,
        explanation: '"Blasted" is the action — what the rocket did. That makes it the verb.'
      },
      {
        type: 'multiple-choice',
        id: 'ela-4-2-p3', grade: 4,
        question: '"Three hungry wolves chased the slow deer through the dense forest."\n\nHow many ADJECTIVES are in this sentence?',
        options: ['4', '2', '3', '5'],
        answer: 0,
        explanation: 'There are 4 adjectives: three (wolves), hungry (wolves), slow (deer), dense (forest).'
      },
      {
        type: 'fill-blank',
        id: 'ela-4-2-p4', grade: 4,
        question: '"The little puppy slept on the soft blanket."\n\nWhat is the VERB in this sentence? (What is the puppy doing?)',
        answer: 'slept',
        hint: 'What action is happening in the sentence?',
        explanation: '"Slept" is the verb — it tells us what the puppy did.'
      },
      {
        type: 'multiple-choice',
        id: 'ela-4-2-p5', grade: 4,
        question: 'Which of the following is an ADJECTIVE?',
        options: ['enormous', 'jumped', 'mountain', 'quickly'],
        answer: 0,
        explanation: '"Enormous" describes something (what kind? enormous!) — it\'s an adjective. "Jumped" is a verb, "mountain" is a noun.'
      },
      {
        type: 'fill-blank',
        id: 'ela-4-2-p6', grade: 4,
        question: '"The ancient Egyptian pyramids still stand in the hot desert."\n\nName ONE noun from this sentence.',
        answer: 'pyramids',
        hint: 'Look for a person, place, or thing.',
        explanation: 'Pyramids, desert, and Egyptian are all nouns in this sentence. Any of those works!'
      },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WRITING GRADE 5
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'writing-5-1',
    subject: 'writing', grade: 5, lessonNumber: 1,
    title: 'The Writing Process',
    intro: "Writing is a PROCESS — not something that just happens in one shot. Even professional authors go through multiple steps. Today we're going to learn those steps so that your writing gets better every single time.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'Step 1: Prewriting — Plan before you write',
        content: `Before you write a single sentence, PLAN.

This is the step most people skip — and it's why their writing ends up disorganized.

Prewriting includes:
• **Brainstorming** — dump every idea onto paper, don't filter yet
• **Choosing** your best idea
• **Organizing** — decide what order to say things in

You can organize with a list, a web (bubble map), or an outline.
The format doesn't matter. What matters is having a plan before you start.`
      },
      {
        type: 'explain',
        heading: 'Step 2: Drafting — Just write, don\'t stop',
        content: `A draft is your first attempt. It's NOT supposed to be perfect.

When you draft:
• Write as fast as you can
• Don't stop to fix mistakes — that comes later
• If you can't think of a word, write a blank or any word and keep going
• Get your ideas out on paper first

The goal of drafting is to have SOMETHING to work with. You can't improve nothing.`
      },
      {
        type: 'explain',
        heading: 'Step 3: Revising — Make it better',
        content: `Revising means looking at your writing and improving the CONTENT and ORGANIZATION.

Ask yourself:
• Does my writing make sense?
• Are my ideas in a logical order?
• Did I explain things clearly?
• Does every sentence belong here?
• Can I add more detail anywhere?

Revising is NOT about fixing spelling — that's next. Revising is about making your IDEAS better.`
      },
      {
        type: 'explain',
        heading: 'Step 4: Editing — Fix the mechanics',
        content: `NOW you fix the small stuff:
• Spelling mistakes
• Capitalization (start of sentences, proper nouns)
• Punctuation (. ? ! , )
• Grammar errors

A trick: read your writing OUT LOUD. Your ear catches mistakes your eyes miss.

Another trick: read it backwards, sentence by sentence. You'll see mistakes you skipped over when reading forward.`
      },
      {
        type: 'explain',
        heading: 'Step 5: Publishing — Share your work',
        content: `Publishing means creating your final, clean copy to share with others.

This could be:
• Typing it up neatly
• Writing it in your best handwriting
• Reading it aloud to someone
• Posting it somewhere

Publishing gives your writing a purpose — you wrote it for a REASON and now it reaches an audience.`
      },
      {
        type: 'tip',
        heading: '💡 The steps can repeat',
        content: `Here's something many people don't know: the writing process isn't always a straight line.

You might draft → revise → realize you need more ideas → go back and prewrite again → draft more → revise again.

That's totally normal! Professional writers go back and forth between steps all the time.

The process is a TOOL, not a rigid rule.`
      },
    ],
    practice: [
      {
        type: 'multiple-choice',
        id: 'writing-5-1-p1', grade: 5,
        question: 'Your teacher asks you to write about your favorite place. What should you do FIRST?',
        options: ['Brainstorm and plan your ideas', 'Start writing immediately', 'Check your spelling', 'Write your final copy'],
        answer: 0,
        explanation: 'Prewriting (planning) always comes first! Jumping straight to writing usually leads to disorganized work.'
      },
      {
        type: 'multiple-choice',
        id: 'writing-5-1-p2', grade: 5,
        question: 'During DRAFTING, what should you focus on?',
        options: ['Getting your ideas on paper without stopping to fix mistakes', 'Making every sentence perfect', 'Checking your spelling carefully', 'Writing your final clean copy'],
        answer: 0,
        explanation: 'Drafting = write fast and get ideas out. Perfecting comes in revising and editing.'
      },
      {
        type: 'multiple-choice',
        id: 'writing-5-1-p3', grade: 5,
        question: 'What is the difference between REVISING and EDITING?',
        options: ['Revising improves ideas and organization; editing fixes grammar and spelling', 'They mean the same thing', 'Editing comes before revising', 'Revising only fixes punctuation'],
        answer: 0,
        explanation: 'Revising = better content and organization. Editing = fixing mechanical errors. They\'re two different things!'
      },
      {
        type: 'fill-blank',
        id: 'writing-5-1-p4', grade: 5,
        question: 'What is the writing step where you fix spelling, capitalization, and punctuation called?',
        answer: 'editing',
        hint: 'It comes after revising.',
        explanation: 'Editing is where you fix the mechanics: spelling, capitalization, and punctuation.'
      },
      {
        type: 'multiple-choice',
        id: 'writing-5-1-p5', grade: 5,
        question: 'Marcus wrote a draft but realizes his ideas are out of order and don\'t flow well. Which step should he do next?',
        options: ['Revising', 'Publishing', 'Editing', 'Prewriting'],
        answer: 0,
        explanation: 'Organization and flow are content issues — that means revising! Editing is just for grammar and spelling.'
      },
    ]
  },

  {
    id: 'writing-5-2',
    subject: 'writing', grade: 5, lessonNumber: 2,
    title: 'Writing Strong Topic Sentences',
    intro: "A topic sentence is the most powerful sentence in a paragraph. Get it right, and the rest of the paragraph almost writes itself. Today we're going to learn exactly what makes one strong — and practice writing them.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'What is a topic sentence?',
        content: `A topic sentence tells the reader:
1. **What** the paragraph is about
2. **What point** you're making about it

It's usually the FIRST sentence of a paragraph, and every other sentence in the paragraph should support it.

Think of it like a promise: your topic sentence promises what the paragraph will deliver. The other sentences keep that promise.`
      },
      {
        type: 'example',
        heading: 'Weak vs. Strong topic sentences',
        content: `Let's compare some examples:

❌ **Too vague:** "Dogs are animals."
(This says almost nothing. Of course dogs are animals.)

❌ **Too narrow:** "My dog Biscuit is brown."
(This is just one tiny detail — it doesn't give a paragraph a real direction.)

✅ **Just right:** "Dogs make loyal and loving companions for families of all kinds."
(This is specific, makes a real claim, and gives the paragraph direction!)

---

❌ **Too vague:** "Exercise is a thing people do."

❌ **Too narrow:** "Running burns calories."

✅ **Just right:** "Regular exercise improves both physical health and mental well-being."
(Strong! It tells us WHAT — exercise — and WHY it matters — it improves health AND mental well-being.)`
      },
      {
        type: 'explain',
        heading: 'How to write a topic sentence',
        content: `Try this formula:

**[Topic] + [Your point about it] = Topic sentence**

Example:
• Topic: video games
• Your point: they can actually teach useful skills
• Topic sentence: "Video games can teach players valuable skills like problem-solving and teamwork."

Example 2:
• Topic: the ocean
• Your point: it's in danger from pollution
• Topic sentence: "The world's oceans face serious threats from plastic pollution and climate change."

Notice how each topic sentence would give a paragraph a CLEAR direction? That's the goal.`
      },
      {
        type: 'tip',
        heading: '💡 Test your topic sentence',
        content: `After you write a topic sentence, ask yourself:

1. Could someone write a whole paragraph from this? (If yes, ✓)
2. Does it make a real point, not just state a fact? (If yes, ✓)
3. Is it specific enough to guide the paragraph? (If yes, ✓)

If you answer no to any of these, rewrite the topic sentence until it passes all three tests.`
      },
    ],
    practice: [
      {
        type: 'multiple-choice',
        id: 'writing-5-2-p1', grade: 5,
        question: 'Which is the STRONGEST topic sentence for a paragraph about homework?',
        options: [
          'Although homework can feel tedious, it helps students practice and retain what they learn.',
          'Homework exists.',
          'I have a lot of homework.',
          'Students do homework after school.'
        ],
        answer: 0,
        explanation: 'The best topic sentence makes a real point and gives the paragraph direction. The first option does both — it acknowledges a counterpoint AND makes a claim.'
      },
      {
        type: 'multiple-choice',
        id: 'writing-5-2-p2', grade: 5,
        question: 'What should every sentence in a paragraph do in relation to the topic sentence?',
        options: ['Support or explain the topic sentence', 'Introduce a new topic', 'Repeat the topic sentence in different words', 'End the paragraph'],
        answer: 0,
        explanation: 'Every sentence in a paragraph must connect back to and support the topic sentence. If a sentence doesn\'t — cut it!'
      },
      {
        type: 'fill-blank',
        id: 'writing-5-2-p3', grade: 5,
        question: 'Where is a topic sentence usually found in a paragraph?',
        answer: 'first',
        hint: 'It\'s usually at the beginning.',
        explanation: 'Topic sentences are usually the FIRST sentence of a paragraph, so the reader knows immediately what\'s coming.'
      },
      {
        type: 'multiple-choice',
        id: 'writing-5-2-p4', grade: 5,
        question: 'Which topic sentence is TOO NARROW (just a single small detail)?',
        options: [
          'The Amazon River is 3,976 miles long.',
          'The Amazon River is one of the most important ecosystems on Earth.',
          'The Amazon River faces serious environmental threats.',
          'The Amazon River supports an incredible variety of life.'
        ],
        answer: 0,
        explanation: 'A single fact (how long it is) can\'t support a whole paragraph — it\'s too narrow. The other options make real claims that can be developed.'
      },
      {
        type: 'multiple-choice',
        id: 'writing-5-2-p5', grade: 5,
        question: 'Using the formula "[Topic] + [Your point]" — which best follows this formula?',
        options: [
          'Space exploration has led to many technologies we use in everyday life.',
          'Space is very big.',
          'Astronauts go to space.',
          'There are planets in space.'
        ],
        answer: 0,
        explanation: 'Topic = space exploration. Point = it led to everyday technologies. That\'s a complete, strong topic sentence!'
      },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCIENCE GRADE 8
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'science-8-1',
    subject: 'science', grade: 8, lessonNumber: 1,
    title: "Newton's Laws of Motion",
    intro: "Newton's Laws of Motion are some of the most powerful ideas in all of science. Once you understand them, you'll start seeing them everywhere — in sports, in cars, in rockets, in everyday life. Let's break them down one by one.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: "First Law — The Law of Inertia",
        content: `Newton's First Law says:

**"An object at rest stays at rest, and an object in motion stays in motion — unless acted on by an outside force."**

The key word here is **inertia** — an object's resistance to changes in its motion.

In plain language:
• Things that are STILL want to stay still
• Things that are MOVING want to keep moving
• It takes a FORCE to change either of these

Examples you've seen:
• A book sitting on a desk doesn't move until you push it
• When a car stops suddenly, you lurch forward — your body wanted to keep moving
• A hockey puck sliding on ice keeps going until friction or the wall stops it`
      },
      {
        type: 'explain',
        heading: 'Why seat belts exist — First Law in action',
        content: `Here's a powerful real-world example:

Imagine you're in a car moving at 60 mph. The car hits a wall and stops instantly.

What happens to YOU?

Your body has inertia — it was moving at 60 mph and wants to KEEP moving. Without a seat belt, you'd fly forward through the windshield.

The seat belt applies a force to YOU, stopping you along with the car.

That's Newton's First Law protecting your life. Physics saves the day!`
      },
      {
        type: 'explain',
        heading: 'Second Law — F = ma',
        content: `Newton's Second Law says:

**Force = Mass × Acceleration**
**(F = ma)**

What does this mean?

• **Force** — a push or pull (measured in Newtons)
• **Mass** — how much matter is in an object (measured in kg)
• **Acceleration** — how fast the velocity is changing (measured in m/s²)

Two key relationships:
1. MORE force → MORE acceleration (push harder, it moves faster)
2. MORE mass → LESS acceleration (heavier objects are harder to speed up)

Example: Push a shopping cart and a car with the same force. The cart accelerates quickly. The car barely moves. Same force, different mass = different acceleration.`
      },
      {
        type: 'example',
        heading: 'Using F = ma',
        content: `Let's solve a problem:

A box has a mass of 5 kg. A force of 20 N pushes it. What is its acceleration?

**F = ma** → rearrange to find a: **a = F ÷ m**

a = 20 ÷ 5 = **4 m/s²**

The box accelerates at 4 meters per second squared.

---

Another one: A 10 kg object accelerates at 3 m/s². What force was applied?

**F = m × a = 10 × 3 = 30 N**

The force is 30 Newtons.`
      },
      {
        type: 'explain',
        heading: 'Third Law — Action and Reaction',
        content: `Newton's Third Law says:

**"For every action, there is an equal and opposite reaction."**

This means whenever Object A pushes on Object B, Object B pushes back on Object A with the SAME force but in the OPPOSITE direction.

Examples:
• You push against a wall → the wall pushes back on you (that's why your hand doesn't go through it)
• A rocket engine pushes gas DOWN → the gas pushes the rocket UP
• You jump off the ground → you push Earth DOWN, Earth pushes you UP
• When you row a boat, the oar pushes water backward → water pushes the boat forward

The forces are always EQUAL and always in OPPOSITE directions.`
      },
      {
        type: 'tip',
        heading: '💡 Quick summary of all three laws',
        content: `**First Law:** Objects keep doing what they're doing unless a force acts on them. (Inertia)

**Second Law:** F = ma. More force = more acceleration. More mass = less acceleration.

**Third Law:** Every action has an equal and opposite reaction.

A fun way to remember them:
1. Things are lazy — they don't change without a push
2. Push harder = go faster; heavier = slower
3. Everything pushes back`
      },
    ],
    practice: [
      {
        type: 'multiple-choice',
        id: 'science-8-1-p1', grade: 8,
        question: 'A soccer ball rolling on grass eventually slows down and stops. Which law explains this?',
        options: [
          "Newton's First Law — friction is an outside force that changes the ball's motion",
          "Newton's Second Law — the ball loses mass as it rolls",
          "Newton's Third Law — the grass pushes the ball backward",
          "None of Newton's laws apply here"
        ],
        answer: 0,
        explanation: "First Law: objects in motion stay in motion UNLESS an outside force acts on them. Friction from the grass is that outside force — it slows the ball down."
      },
      {
        type: 'fill-blank',
        id: 'science-8-1-p2', grade: 8,
        question: 'Using F = ma: A 6 kg object accelerates at 5 m/s². What is the force? (Write just the number)',
        answer: '30',
        hint: 'F = m × a = 6 × 5 = ?',
        explanation: 'F = 6 × 5 = 30 Newtons.'
      },
      {
        type: 'multiple-choice',
        id: 'science-8-1-p3', grade: 8,
        question: 'A swimmer pushes off the pool wall and glides forward. Which law explains this?',
        options: [
          "Third Law — the wall pushes the swimmer forward with equal and opposite force",
          "First Law — the swimmer was already moving",
          "Second Law — the swimmer has less mass than the wall",
          "First Law — the wall had inertia"
        ],
        answer: 0,
        explanation: "Action: swimmer pushes wall backward. Reaction: wall pushes swimmer forward with equal force. That's Newton's Third Law."
      },
      {
        type: 'step-by-step',
        id: 'science-8-1-p4', grade: 8,
        problem: "Let's use F = ma to solve a problem. A 15 kg sled is pushed with a force of 45 N. What is its acceleration?",
        steps: [
          {
            instruction: "Write out the formula. We know F and m, and we need to find a. Rearrange F = ma to solve for a.",
            prompt: "a = F ÷ m. What is F?",
            answer: "45",
            explanation: "F = 45 N (the force applied). Good — now we know what to plug in."
          },
          {
            instruction: "What is the mass (m) of the sled?",
            prompt: "m = ? kg",
            answer: "15",
            explanation: "m = 15 kg. Now we can calculate: a = F ÷ m = 45 ÷ 15."
          },
          {
            instruction: "Calculate: a = 45 ÷ 15 = ?",
            prompt: "a = 45 ÷ 15 = ?",
            answer: "3",
            explanation: "a = 3 m/s². The sled accelerates at 3 meters per second squared."
          },
        ],
        finalAnswer: "3 m/s²"
      },
      {
        type: 'multiple-choice',
        id: 'science-8-1-p5', grade: 8,
        question: "Two cars have the same engine (same force). Car A weighs 1,000 kg. Car B weighs 2,000 kg. Which car accelerates faster?",
        options: [
          "Car A — less mass means more acceleration",
          "Car B — more mass means more acceleration",
          "They accelerate the same",
          "It depends on the road"
        ],
        answer: 0,
        explanation: "Newton's Second Law: a = F/m. Same force, but Car A has half the mass — so Car A gets twice the acceleration."
      },
    ]
  },

  {
    id: 'science-8-2',
    subject: 'science', grade: 8, lessonNumber: 2,
    title: 'DNA and Heredity',
    intro: "Ever wonder why you look like your parents? Or why some traits skip a generation? It all comes down to DNA and heredity. This is one of the coolest topics in science — let's dig in.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'What is DNA?',
        content: `**DNA** stands for **deoxyribonucleic acid** (don't worry about memorizing that name).

DNA is a molecule — a very long, very thin molecule — that contains the instructions for building and running a living organism. It's found in the **nucleus** of every cell in your body.

The shape of DNA is called a **double helix** — think of a twisted ladder.
• The "sides" of the ladder = sugar and phosphate molecules
• The "rungs" of the ladder = pairs of chemical bases

There are 4 bases, and they always pair the same way:
• **A** (adenine) always pairs with **T** (thymine)
• **G** (guanine) always pairs with **C** (cytosine)

The order of these bases is like a code — and that code spells out the instructions for YOU.`
      },
      {
        type: 'explain',
        heading: 'Genes and Chromosomes',
        content: `Here's how DNA is organized:

**DNA** → coiled up into → **Chromosomes** → contain → **Genes**

• **Chromosomes** are long, tightly coiled strands of DNA. Human cells have **46 chromosomes** — 23 pairs.
• **Genes** are specific sections of DNA that code for a specific trait (like eye color, blood type, or height).
• Humans have about **20,000–25,000 genes** total.

You got 23 chromosomes from your mom and 23 from your dad — that's how you have 46 total.

So half of your DNA is from your mother and half is from your father.`
      },
      {
        type: 'explain',
        heading: 'Dominant and Recessive Traits',
        content: `For most traits, you have TWO versions of each gene — one from mom, one from dad. These versions are called **alleles**.

Some alleles are **dominant** — they show up even if you only have one copy. We write these with a CAPITAL letter (like **B** for brown eyes).

Some alleles are **recessive** — they only show up if you have TWO copies. We write these with a lowercase letter (like **b** for blue eyes).

Your combination is called your **genotype**. What you actually look like is your **phenotype**.

| Genotype | Phenotype (what you see) |
|----------|--------------------------|
| BB | Brown eyes |
| Bb | Brown eyes (B is dominant — it wins!) |
| bb | Blue eyes (two recessive = shows up) |

So two brown-eyed parents who both carry a "b" allele can have a blue-eyed child!`
      },
      {
        type: 'example',
        heading: 'Punnett Squares — predicting traits',
        content: `A **Punnett square** is a simple tool for predicting what traits offspring might have.

If Dad is **Bb** (brown eyes, carries blue) and Mom is **Bb** (same):

        B    b
   B  | BB | Bb |
   b  | Bb | bb |

Results:
• BB = 25% chance (brown eyes)
• Bb = 50% chance (brown eyes — B is dominant)
• bb = 25% chance (blue eyes)

So 75% chance of brown eyes, 25% chance of blue eyes.

This is PROBABILITY, not a guarantee. These are just likelihoods.`
      },
      {
        type: 'explain',
        heading: 'Mutations',
        content: `A **mutation** is a change in the DNA sequence — like a typo in the instruction manual.

Most mutations are:
• **Harmless** — have no effect at all
• **Harmful** — can cause genetic diseases
• **Beneficial** — rarely, a mutation actually helps (this is how evolution works over millions of years!)

Mutations can happen:
• Randomly when cells copy DNA (copy errors)
• From UV radiation (this is why sunscreen matters!)
• From certain chemicals

Your body has repair systems that catch and fix most mutations before they become a problem.`
      },
    ],
    practice: [
      {
        type: 'multiple-choice',
        id: 'science-8-2-p1', grade: 8,
        question: 'What is the shape of a DNA molecule called?',
        options: ['Double helix', 'Single strand', 'Circle', 'Square lattice'],
        answer: 0,
        explanation: 'DNA is shaped like a twisted ladder — called a double helix. Discovered by Watson and Crick in 1953.'
      },
      {
        type: 'fill-blank',
        id: 'science-8-2-p2', grade: 8,
        question: 'How many chromosomes do human body cells normally contain?',
        answer: '46',
        hint: 'You get 23 from mom and 23 from dad...',
        explanation: 'Humans have 46 chromosomes — 23 pairs. Half come from mom, half from dad.'
      },
      {
        type: 'multiple-choice',
        id: 'science-8-2-p3', grade: 8,
        question: 'A child has genotype Bb for eye color. B (brown) is dominant, b (blue) is recessive. What color are their eyes?',
        options: ['Brown', 'Blue', 'Green', 'It depends on other genes only'],
        answer: 0,
        explanation: 'Bb = one dominant allele (B) and one recessive (b). The dominant ALWAYS shows when present. So the child has brown eyes.'
      },
      {
        type: 'step-by-step',
        id: 'science-8-2-p4', grade: 8,
        problem: "Let's work through a Punnett square. Dad is BB (brown eyes). Mom is bb (blue eyes). What are the possible genotypes of their children?",
        steps: [
          {
            instruction: "Dad is BB — he can only pass ONE allele to each child. What allele does he pass?",
            prompt: "Dad (BB) passes only the letter ___",
            answer: "B",
            explanation: "BB has two B alleles. Every child gets one from Dad — and it will always be B."
          },
          {
            instruction: "Mom is bb — she can only pass ONE allele. What allele does she pass?",
            prompt: "Mom (bb) passes only the letter ___",
            answer: "b",
            explanation: "bb has two b alleles. Every child gets one from Mom — and it will always be b."
          },
          {
            instruction: "Every child gets B from Dad and b from Mom. What is every child's genotype?",
            prompt: "Every child is ___",
            answer: "Bb",
            explanation: "All children will be Bb. Since B is dominant, ALL children will have brown eyes — but all carry the recessive b gene."
          },
        ],
        finalAnswer: "Bb — all children have brown eyes"
      },
      {
        type: 'multiple-choice',
        id: 'science-8-2-p5', grade: 8,
        question: 'Which base pair combination is CORRECT in DNA?',
        options: ['A pairs with T, G pairs with C', 'A pairs with G, T pairs with C', 'A pairs with C, G pairs with T', 'All bases pair with each other'],
        answer: 0,
        explanation: 'Base pairing rules: A-T and G-C. Always. This consistent pairing is what allows DNA to copy itself accurately.'
      },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HISTORY GRADE 7
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'history-7-1',
    subject: 'history', grade: 7, lessonNumber: 1,
    title: 'Causes of the American Civil War',
    intro: "The Civil War is one of the most important events in American history. It didn't start overnight — tensions had been building for decades. Today we're going to understand exactly WHY it happened, which makes the whole thing make a lot more sense.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'The core issue: Slavery',
        content: `The most fundamental cause of the Civil War was **slavery**.

By 1860, nearly **4 million enslaved people** lived in the Southern United States. Enslaved people were forced to work on plantations growing cotton, tobacco, sugar, and rice.

The Southern economy depended almost entirely on this system. Enslaved labor made plantation owners enormously wealthy.

Meanwhile, Northern states had largely abolished slavery. The North's economy was based on factories, wage workers, and industry — not plantation agriculture.

This created a massive divide between the regions — not just morally, but economically. The South feared that any threat to slavery was a threat to their entire way of life.`
      },
      {
        type: 'explain',
        heading: "States' Rights",
        content: `Southern states believed strongly in **states' rights** — the idea that individual states have the right to govern themselves without too much interference from the federal (national) government.

Specifically, Southern states believed they had the right to:
• Maintain slavery within their borders
• Make their own decisions about social and economic policies
• Leave the Union if they chose to

The federal government's attempt to limit the spread of slavery felt like an attack on Southern independence.

This debate — how much power the federal government should have vs. the states — is one of the oldest arguments in American politics. The Civil War was, in many ways, the most violent expression of that argument.`
      },
      {
        type: 'explain',
        heading: 'The Westward Expansion Problem',
        content: `As the United States expanded westward and new territories became states, a huge question arose: would these new states allow slavery or not?

This wasn't just a moral question — it was a political power question. More slave states = more Southern votes in Congress. More free states = more Northern votes.

Congress kept trying to strike compromises:
• **Missouri Compromise (1820)** — drew a line; slavery allowed south of it, banned north of it
• **Compromise of 1850** — admitted California as a free state but strengthened the Fugitive Slave Law
• **Kansas-Nebraska Act (1854)** — let territories vote on slavery themselves → led to violent conflict in Kansas ("Bleeding Kansas")

Each compromise just delayed the conflict. None solved it.`
      },
      {
        type: 'explain',
        heading: 'The Election of 1860 — the breaking point',
        content: `In November 1860, **Abraham Lincoln** was elected president.

Lincoln was a member of the newly formed **Republican Party**, which opposed the spread of slavery into new territories.

Here's the shocking part: Lincoln won the presidency **without winning a single Southern state**. He wasn't even on the ballot in most of them. Southerners felt the federal government had been taken over by people who didn't represent them at all.

**South Carolina seceded** (left the Union) within weeks of Lincoln's election. By February 1861, six more states had followed: Mississippi, Florida, Alabama, Georgia, Louisiana, and Texas.

Together they formed the **Confederate States of America** and elected Jefferson Davis as their president.`
      },
      {
        type: 'explain',
        heading: 'The War Begins: Fort Sumter',
        content: `On **April 12, 1861**, Confederate forces fired on **Fort Sumter** — a Union military fort in Charleston, South Carolina.

This was the first battle of the Civil War.

Why Fort Sumter? The Confederacy demanded that Union troops leave. When they refused, Confederate artillery opened fire. After 34 hours of bombardment, the Union garrison surrendered.

No one was killed in the battle itself — but it triggered a massive call for troops on both sides. Within weeks, four more states joined the Confederacy (Virginia, Arkansas, Tennessee, and North Carolina), and the war was fully underway.

The Civil War would last four years and kill approximately **620,000 to 750,000 soldiers** — more Americans than in any other war.`
      },
    ],
    practice: [
      {
        type: 'multiple-choice',
        id: 'history-7-1-p1', grade: 7,
        question: 'What was the most fundamental cause of the Civil War?',
        options: ['Slavery', 'Disagreements over taxes', 'A border dispute with Mexico', 'Religious differences'],
        answer: 0,
        explanation: 'Slavery was the central issue — it drove the economic, political, and moral divisions between North and South.'
      },
      {
        type: 'fill-blank',
        id: 'history-7-1-p2', grade: 7,
        question: 'What event officially started the Civil War in April 1861?',
        answer: 'Fort Sumter',
        hint: 'It was a Union fort in South Carolina that Confederate forces attacked.',
        explanation: 'Confederate forces attacked Fort Sumter on April 12, 1861 — the first battle of the Civil War.'
      },
      {
        type: 'multiple-choice',
        id: 'history-7-1-p3', grade: 7,
        question: 'Why did Southern states secede after Lincoln\'s election in 1860?',
        options: [
          'Lincoln opposed the spread of slavery and won without a single Southern state\'s support',
          'Lincoln declared war on the South immediately after being elected',
          'Lincoln raised taxes on Southern farmers',
          'Lincoln abolished slavery as soon as he was elected'
        ],
        answer: 0,
        explanation: 'Lincoln\'s Republican Party opposed expanding slavery. He won without any Southern votes, making Southerners feel politically abandoned and threatened.'
      },
      {
        type: 'multiple-choice',
        id: 'history-7-1-p4', grade: 7,
        question: 'What did the Missouri Compromise (1820) attempt to do?',
        options: [
          'Draw a geographic line dividing where slavery was allowed vs. banned',
          'End slavery in all states immediately',
          'Give territories the right to vote on slavery',
          'Admit Missouri as a free state'
        ],
        answer: 0,
        explanation: 'The Missouri Compromise drew a line across the country — slavery was allowed south of it and banned north of it in new territories.'
      },
      {
        type: 'fill-blank',
        id: 'history-7-1-p5', grade: 7,
        question: 'The Confederate States of America elected __________ as their president.',
        answer: 'Jefferson Davis',
        hint: 'He was a senator from Mississippi before the war.',
        explanation: 'Jefferson Davis was elected president of the Confederacy in 1861.'
      },
      {
        type: 'multiple-choice',
        id: 'history-7-1-p6', grade: 7,
        question: 'Which of the following was NOT a cause of the Civil War?',
        options: [
          'A disagreement about the design of the American flag',
          'Debates over slavery',
          'Disagreements about states\' rights',
          'Economic differences between North and South'
        ],
        answer: 0,
        explanation: 'The flag design had nothing to do with the Civil War. The actual causes were slavery, states\' rights, economic differences, and the westward expansion debate.'
      },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MATH GRADE 5, 6, 7 (existing content, reformatted)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'math-5-1',
    subject: 'math', grade: 5, lessonNumber: 1,
    title: 'Multiplying Fractions',
    intro: "Fractions can seem tricky, but multiplying them is actually one of the EASIER fraction operations. Let's walk through it carefully.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'The rule: multiply straight across',
        content: `To multiply fractions, multiply the top numbers (numerators) together, then multiply the bottom numbers (denominators) together.

(a/b) × (c/d) = (a×c) / (b×d)

That's really it. No need to find common denominators like you do with addition.`
      },
      {
        type: 'example',
        heading: 'Example: ½ × ¾',
        content: `½ × ¾

Top: 1 × 3 = 3
Bottom: 2 × 4 = 8

Answer: 3/8

Is it in simplest form? Yes — 3 and 8 share no common factors.`
      },
      {
        type: 'example',
        heading: 'Example: 2/3 × 3/5',
        content: `2/3 × 3/5

Top: 2 × 3 = 6
Bottom: 3 × 5 = 15

Answer: 6/15

Can we simplify? Yes! GCF of 6 and 15 is 3.
6 ÷ 3 = 2, 15 ÷ 3 = 5

Simplified: **2/5**`
      },
      {
        type: 'tip',
        heading: '💡 Cross-simplify to make it easier',
        content: `Before multiplying, check if you can simplify diagonally.

In 2/3 × 3/5 — the 3 on the top of the second fraction and the 3 on the bottom of the first fraction are the same. Divide both by 3:

2/3 × 3/5 → 2/1 × 1/5 = 2/5

Same answer, less work!`
      },
    ],
    practice: [
      { type: 'multiple-choice', id: 'ml5-1-q1', grade: 5, question: '1/2 × 2/3 = ?', options: ['1/3', '2/5', '3/4', '1/6'], answer: 0, explanation: '(1×2)/(2×3) = 2/6 = 1/3' },
      { type: 'fill-blank', id: 'ml5-1-q2', grade: 5, question: '3/4 × 4/5 = ? (simplify your answer)', answer: '3/5', hint: 'Multiply straight across, then simplify.', explanation: '(3×4)/(4×5) = 12/20. Simplify by dividing by 4: 3/5.' },
      { type: 'multiple-choice', id: 'ml5-1-q3', grade: 5, question: '2/5 × 5/6 = ?', options: ['1/3', '10/30', '2/6', '7/11'], answer: 0, explanation: '(2×5)/(5×6) = 10/30 = 1/3. Or cross-simplify: 5s cancel → 2/1 × 1/6 = 2/6 = 1/3.' },
    ]
  },
  {
    id: 'math-5-2',
    subject: 'math', grade: 5, lessonNumber: 2,
    title: 'Dividing Fractions',
    intro: "Dividing fractions sounds scary — but there's a trick that makes it as easy as multiplying. Three words: Keep, Change, Flip.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'Keep, Change, Flip',
        content: `To divide fractions:
1. **Keep** the first fraction exactly as-is
2. **Change** the ÷ sign to ×
3. **Flip** the second fraction (write its reciprocal — swap top and bottom)

Then multiply normally.`
      },
      {
        type: 'example',
        heading: 'Example: 3/4 ÷ 1/2',
        content: `3/4 ÷ 1/2

Keep: 3/4
Change: ÷ → ×
Flip: 1/2 → 2/1

New problem: 3/4 × 2/1 = 6/4 = 3/2 = 1½`
      },
    ],
    practice: [
      { type: 'multiple-choice', id: 'ml5-2-q1', grade: 5, question: '1/2 ÷ 1/4 = ?', options: ['2', '1/8', '1/2', '4'], answer: 0, explanation: '1/2 × 4/1 = 4/2 = 2' },
      { type: 'fill-blank', id: 'ml5-2-q2', grade: 5, question: '3/5 ÷ 3/10 = ?', answer: '2', hint: 'Keep 3/5, Change to ×, Flip 3/10 to 10/3', explanation: '3/5 × 10/3 = 30/15 = 2' },
      { type: 'multiple-choice', id: 'ml5-2-q3', grade: 5, question: 'What is the first step when dividing fractions?', options: ['Keep the first fraction the same', 'Flip the first fraction', 'Find a common denominator', 'Add the fractions'], answer: 0, explanation: 'Keep the first fraction, Change ÷ to ×, Flip the second.' },
    ]
  },
  {
    id: 'math-6-1',
    subject: 'math', grade: 6, lessonNumber: 1,
    title: 'Introduction to Ratios',
    intro: "Ratios show up everywhere — recipes, maps, sports stats, prices. Let's make sure you really understand what they mean.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'What is a ratio?',
        content: `A ratio compares two quantities. You can write it three ways:
• 3:4
• 3/4
• "3 to 4"

Example: a class has 3 boys and 4 girls. Ratio of boys to girls = 3:4`
      },
      {
        type: 'explain',
        heading: 'Equivalent ratios',
        content: `Equivalent ratios are like equivalent fractions — multiply or divide both parts by the same number.

3:4 = 6:8 = 9:12 = 15:20

All the same ratio, just scaled up.`
      },
    ],
    practice: [
      { type: 'multiple-choice', id: 'ml6-1-q1', grade: 6, question: 'A recipe uses 2 cups of flour for every 3 cups of sugar. What is the ratio of flour to sugar?', options: ['2:3', '3:2', '2:5', '1:3'], answer: 0, explanation: 'Flour to sugar = 2:3, in the order asked.' },
      { type: 'fill-blank', id: 'ml6-1-q2', grade: 6, question: 'If the ratio of boys to girls is 3:5 and there are 15 boys, how many girls are there?', answer: '25', hint: '3:5 = 15:? Multiply both by 5.', explanation: '3 × 5 = 15, so 5 × 5 = 25 girls.' },
      { type: 'multiple-choice', id: 'ml6-1-q3', grade: 6, question: 'Which ratio is equivalent to 4:6?', options: ['2:3', '3:4', '4:5', '6:4'], answer: 0, explanation: '4:6 divided by 2 = 2:3.' },
    ]
  },
  {
    id: 'math-6-2',
    subject: 'math', grade: 6, lessonNumber: 2,
    title: 'Percents',
    intro: "Percent literally means 'per hundred.' Once you get that, everything else clicks.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'What is a percent?',
        content: `**Percent** = per hundred. The % symbol means /100.

50% = 50/100 = 0.50 = ½
25% = 25/100 = 0.25 = ¼

To convert a percent to a decimal: divide by 100 (move decimal 2 places left).
35% → 0.35`
      },
      {
        type: 'example',
        heading: 'Finding a percent of a number',
        content: `What is 30% of 200?

Convert 30% to decimal: 0.30
Multiply: 200 × 0.30 = 60

30% of 200 = 60.`
      },
    ],
    practice: [
      { type: 'fill-blank', id: 'ml6-2-q1', grade: 6, question: 'What is 20% of 150?', answer: '30', hint: '150 × 0.20', explanation: '150 × 0.20 = 30' },
      { type: 'multiple-choice', id: 'ml6-2-q2', grade: 6, question: '45 is what percent of 180?', options: ['25%', '20%', '30%', '15%'], answer: 0, explanation: '45 ÷ 180 = 0.25 = 25%' },
      { type: 'fill-blank', id: 'ml6-2-q3', grade: 6, question: 'Convert 35% to a decimal.', answer: '0.35', hint: 'Divide by 100', explanation: '35 ÷ 100 = 0.35' },
    ]
  },
  {
    id: 'math-7-1',
    subject: 'math', grade: 7, lessonNumber: 1,
    title: 'Solving Two-Step Equations',
    intro: "Algebra is just a puzzle where you find the missing number. Two-step equations take two moves to solve — let's walk through them carefully.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'The goal: isolate the variable',
        content: `Your job in any equation is to get the variable (x) alone on one side.

You do this by "undoing" the operations — but in REVERSE order.

Example: 2x + 3 = 11
Operations done to x: multiply by 2, then add 3
Undo in reverse: subtract 3 first, then divide by 2`
      },
      {
        type: 'example',
        heading: 'Solving 2x + 3 = 11',
        content: `2x + 3 = 11

Step 1: Subtract 3 from both sides
2x + 3 − 3 = 11 − 3
2x = 8

Step 2: Divide both sides by 2
2x ÷ 2 = 8 ÷ 2
x = 4

Check: 2(4) + 3 = 8 + 3 = 11 ✓`
      },
    ],
    practice: [
      { type: 'fill-blank', id: 'ml7-1-q1', grade: 7, question: 'Solve: 3x + 4 = 19', answer: '5', hint: 'First subtract 4, then divide by 3.', explanation: '3x = 15, x = 5' },
      { type: 'fill-blank', id: 'ml7-1-q2', grade: 7, question: 'Solve: 2x − 6 = 10', answer: '8', hint: 'First add 6, then divide by 2.', explanation: '2x = 16, x = 8' },
      { type: 'multiple-choice', id: 'ml7-1-q3', grade: 7, question: 'What is the first step to solve 4x + 2 = 18?', options: ['Subtract 2 from both sides', 'Divide both sides by 4', 'Add 2 to both sides', 'Multiply both sides by 4'], answer: 0, explanation: 'Undo addition first (subtract 2), then undo multiplication (divide by 4).' },
    ]
  },
  {
    id: 'math-7-2',
    subject: 'math', grade: 7, lessonNumber: 2,
    title: 'Negative Numbers & Integers',
    intro: "Negative numbers trip a lot of people up — especially when you start multiplying and dividing them. Let's get this totally clear.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'Adding and subtracting negatives',
        content: `Same signs? Add and keep the sign.
−4 + (−3) = −7

Different signs? Subtract and take the sign of the larger absolute value.
−7 + 4 = −3 (7 is bigger, so negative wins)

Subtracting a negative = adding:
5 − (−3) = 5 + 3 = 8`
      },
      {
        type: 'explain',
        heading: 'Multiplying and dividing negatives',
        content: `Simple rules:
• Same signs → Positive: (−3) × (−4) = +12
• Different signs → Negative: (−3) × 4 = −12

Works for division too:
• −12 ÷ (−4) = +3
• −12 ÷ 4 = −3`
      },
    ],
    practice: [
      { type: 'fill-blank', id: 'ml7-2-q1', grade: 7, question: '−8 + 3 = ?', answer: '-5', hint: 'Different signs: subtract, keep sign of larger number (8)', explanation: '−8 + 3 = −5. 8 is larger, so the answer is negative.' },
      { type: 'multiple-choice', id: 'ml7-2-q2', grade: 7, question: '−5 × −6 = ?', options: ['30', '−30', '11', '−11'], answer: 0, explanation: 'Same signs (both negative) = positive. 5 × 6 = 30.' },
      { type: 'fill-blank', id: 'ml7-2-q3', grade: 7, question: '4 − (−7) = ?', answer: '11', hint: 'Subtracting a negative = adding', explanation: '4 − (−7) = 4 + 7 = 11' },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELA GRADE 6
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ela-6-1',
    subject: 'ela', grade: 6, lessonNumber: 1,
    title: 'Finding the Main Idea',
    intro: "Finding the main idea is the foundation of all reading comprehension. Once you can do this reliably, every other reading skill gets easier.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'Main idea vs. details',
        content: `The **main idea** is the most important point the whole passage is making.
The **details** are the specific facts that support and explain the main idea.

Ask: "What is this mostly about?" Your answer is the main idea.`
      },
      {
        type: 'example',
        heading: 'Practice passage',
        content: `*"The ocean covers more than 70% of Earth's surface. It regulates our climate, produces oxygen, and provides food for billions of people. Yet scientists have explored less than 20% of it."*

What is the main idea? The ocean is vital but largely unexplored.

The details (70% coverage, regulates climate, produces oxygen) all support that idea.`
      },
    ],
    practice: [
      { type: 'multiple-choice', id: 'ela6-1-q1', grade: 6, question: 'What is the main idea of a passage?', options: ['The most important point the whole passage makes', 'A fact mentioned once in the passage', 'The first sentence', 'The title'], answer: 0, explanation: 'The main idea is the central message that all the details support.' },
      { type: 'multiple-choice', id: 'ela6-1-q2', grade: 6, question: 'Read: "Exercise improves mood, builds strength, and reduces stress. Studies show even a short daily walk makes a difference." What is the main idea?', options: ['Exercise is very beneficial for your health', 'Walking is the best exercise', 'You must exercise every day', 'Stress is reduced by exercise'], answer: 0, explanation: 'All details point to the broad benefit of exercise.' },
      { type: 'fill-blank', id: 'ela6-1-q3', grade: 6, question: 'True or false: The main idea is always stated in the first sentence. Write "true" or "false."', answer: 'false', hint: 'Think about where authors sometimes put their main point...', explanation: 'False! The main idea can appear at the beginning, end, or even be implied throughout the passage.' },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCIENCE GRADE 6
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'science-6-1',
    subject: 'science', grade: 6, lessonNumber: 1,
    title: 'Cells: The Basic Unit of Life',
    intro: "Every living thing — from a blade of grass to a blue whale to you — is made of cells. Cells are the smallest unit of life. Let's learn what they're made of and how they work.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'Two types of cells',
        content: `All cells are either:
• **Prokaryotic** — no nucleus, simpler (bacteria are prokaryotes)
• **Eukaryotic** — have a nucleus, more complex (plants, animals, fungi)

Your body is made of eukaryotic cells.`
      },
      {
        type: 'explain',
        heading: 'Key parts of an animal cell',
        content: `• **Cell membrane** — controls what enters/exits (like a security guard)
• **Nucleus** — contains DNA, controls the cell ("control center")
• **Mitochondria** — makes energy (ATP) for the cell ("powerhouse")
• **Cytoplasm** — jelly-like fluid that fills the cell
• **Ribosomes** — make proteins`
      },
      {
        type: 'explain',
        heading: 'What plant cells have extra',
        content: `Plant cells have everything animal cells have, PLUS:
• **Cell wall** — rigid outer layer for support (gives plants structure)
• **Chloroplasts** — capture sunlight for photosynthesis (make food)
• **Large central vacuole** — stores water (keeps the plant firm)`
      },
    ],
    practice: [
      { type: 'multiple-choice', id: 'sci6-1-q1', grade: 6, question: 'What is the control center of a cell?', options: ['Nucleus', 'Mitochondria', 'Cell membrane', 'Ribosome'], answer: 0, explanation: 'The nucleus contains DNA and controls the cell\'s activities.' },
      { type: 'fill-blank', id: 'sci6-1-q2', grade: 6, question: 'What organelle is called the "powerhouse of the cell"?', answer: 'mitochondria', hint: 'It makes energy (ATP) for the cell.', explanation: 'Mitochondria produce ATP, the energy currency of the cell.' },
      { type: 'multiple-choice', id: 'sci6-1-q3', grade: 6, question: 'What do plant cells have that animal cells do NOT?', options: ['Cell wall and chloroplasts', 'Nucleus and mitochondria', 'Ribosomes and cytoplasm', 'Cell membrane'], answer: 0, explanation: 'Plant cells have a cell wall for structure and chloroplasts for photosynthesis.' },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WRITING GRADE 6
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'writing-6-1',
    subject: 'writing', grade: 6, lessonNumber: 1,
    title: 'Writing a Strong Paragraph',
    intro: "A well-constructed paragraph is the building block of all good writing. Master this and essays, reports, and everything else becomes much easier.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'The four parts of a paragraph',
        content: `1. **Topic sentence** — states the main idea
2. **Supporting sentences** — provide evidence and details
3. **Elaboration** — explains WHY the evidence matters
4. **Concluding sentence** — wraps it up`
      },
      {
        type: 'example',
        heading: 'A complete paragraph',
        content: `**Topic sentence:** Dogs make excellent companions for families.
**Support:** They are loyal and protective of their owners.
**Support:** Dogs can be trained to assist people with tasks.
**Elaboration:** This loyalty makes dogs not just pets, but true family members.
**Conclusion:** For anyone seeking a devoted companion, a dog is hard to beat.`
      },
    ],
    practice: [
      { type: 'multiple-choice', id: 'wri6-1-q1', grade: 6, question: 'What is the purpose of a topic sentence?', options: ['To state the main idea of the paragraph', 'To provide evidence', 'To conclude the paragraph', 'To introduce a quote'], answer: 0, explanation: 'The topic sentence tells the reader what the entire paragraph is about.' },
      { type: 'multiple-choice', id: 'wri6-1-q2', grade: 6, question: 'What makes elaboration different from just stating evidence?', options: ['It explains WHY the evidence matters', 'It\'s always a quote', 'It repeats the topic sentence', 'It ends the paragraph'], answer: 0, explanation: 'Elaboration goes beyond stating a fact — it explains the significance and connection to the main point.' },
      { type: 'fill-blank', id: 'wri6-1-q3', grade: 6, question: 'What is the LAST part of a well-structured paragraph called?', answer: 'concluding sentence', hint: 'It wraps up the paragraph\'s main idea.', explanation: 'The concluding sentence wraps up the paragraph without just repeating the topic sentence.' },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HISTORY GRADE 7 — additional lessons
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'history-7-2',
    subject: 'history', grade: 7, lessonNumber: 2,
    title: 'The American Revolution: Why Colonists Broke Free',
    intro: "Before the United States existed, there were 13 British colonies — and the people living in them got fed up. Today we're going to find out exactly why they decided to break away from one of the most powerful empires in the world.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'Life in the 13 Colonies',
        content: `By the mid-1700s, about **2.5 million people** lived in Britain's 13 American colonies along the Atlantic coast.

Most colonists thought of themselves as British citizens — they flew the British flag, spoke English, and followed British law.

But they had also built their own communities, farms, and local governments over more than 150 years. They were used to making many of their own decisions.

Then Britain started interfering — and the colonists didn't like it one bit.`
      },
      {
        type: 'explain',
        heading: 'Taxation Without Representation',
        content: `Britain had spent enormous amounts of money fighting the **French and Indian War** (1754–1763) — a war fought partly to protect the American colonies.

Britain decided the colonies should help pay for it. So Parliament passed a series of new taxes:
• **Stamp Act (1765)** — taxed newspapers, legal documents, even playing cards
• **Townshend Acts (1767)** — taxed glass, paper, paint, and tea
• **Tea Act (1773)** — kept a tax on tea and gave one company a monopoly

Here's what made colonists furious: they had **no representatives in Parliament**. They couldn't vote on these taxes. Their rallying cry became:

**"No taxation without representation!"**

They weren't just upset about money — they felt their rights as British citizens were being violated.`
      },
      {
        type: 'example',
        heading: 'The Boston Massacre & Boston Tea Party',
        content: `Tensions kept rising. Two events became symbols of colonial anger:

**Boston Massacre (March 1770)**
British soldiers were stationed in Boston to enforce the new laws. Colonists harassed them constantly. One night, a crowd threw rocks and ice. Soldiers opened fire, killing 5 colonists.

Patriot leader **Paul Revere** spread an engraving of the event that showed it as cold-blooded murder. It became powerful propaganda.

**Boston Tea Party (December 1773)**
Colonists disguised as Mohawk Indians boarded three British ships in Boston Harbor and dumped **342 chests of tea** into the water — about $1.7 million worth in today's money.

Britain's response? They shut down Boston's harbor and restricted Massachusetts's self-government. This outraged the other colonies.`
      },
      {
        type: 'explain',
        heading: 'The Declaration of Independence',
        content: `By 1775, fighting had already broken out at **Lexington and Concord** (the "shot heard 'round the world").

Colonial leaders gathered at the **Second Continental Congress** and appointed **George Washington** to command the Continental Army.

On **July 4, 1776**, they approved the **Declaration of Independence**, written primarily by **Thomas Jefferson**.

Key ideas in the Declaration:
• All men are created equal
• People have unalienable rights: **life, liberty, and the pursuit of happiness**
• When a government violates those rights, the people have the right to change or abolish it

This was revolutionary thinking. Most countries at the time were ruled by kings who claimed their power came from God. The Declaration said power comes from the **consent of the governed**.`
      },
      {
        type: 'explain',
        heading: 'How the Colonists Won',
        content: `Britain had the most powerful military in the world. The colonists had a ragtag militia. How did they win?

Several key factors:
• **Home advantage** — colonists knew the land; British soldiers didn't
• **French alliance** — France joined the American side in 1778, providing money, soldiers, and naval power (France wanted to weaken Britain)
• **Washington's leadership** — he kept the army together through brutal winters and many defeats
• **British overconfidence** — they underestimated colonial determination

The war effectively ended at **Yorktown (1781)**, when Washington and French forces surrounded the British army under General Cornwallis, who surrendered.

The **Treaty of Paris (1783)** officially ended the war and recognized the United States of America as an independent nation.`
      },
      {
        type: 'tip',
        heading: '📌 Key people to know',
        content: `• **George Washington** — Commander of the Continental Army, first U.S. president
• **Thomas Jefferson** — wrote the Declaration of Independence
• **Benjamin Franklin** — diplomat who secured the French alliance
• **Paul Revere** — midnight ride to warn colonists the British were coming
• **King George III** — British king during the revolution
• **Marquis de Lafayette** — French general who fought for American independence`
      },
    ],
    practice: [
      { type: 'multiple-choice', id: 'hist7-2-q1', grade: 7, question: 'What was the colonists\' main complaint about British taxes?', options: ['They had no representatives in Parliament who could vote on the taxes', 'The taxes were too high to afford', 'Only rich colonists had to pay', 'Britain was spending the money on wars in Asia'], answer: 0, explanation: '"No taxation without representation" — colonists felt it violated their rights as British citizens to be taxed by a body they had no voice in.' },
      { type: 'fill-blank', id: 'hist7-2-q2', grade: 7, question: 'Who wrote most of the Declaration of Independence?', answer: 'Thomas Jefferson', hint: 'He later became the 3rd U.S. president.', explanation: 'Thomas Jefferson drafted the Declaration of Independence, with input from Benjamin Franklin and John Adams.' },
      { type: 'multiple-choice', id: 'hist7-2-q3', grade: 7, question: 'Which country became America\'s most important ally during the Revolution?', options: ['France', 'Spain', 'the Netherlands', 'Prussia'], answer: 0, explanation: 'France joined the American side in 1778, providing soldiers, money, and naval power — largely because they wanted to weaken Britain.' },
      { type: 'multiple-choice', id: 'hist7-2-q4', grade: 7, question: 'The Declaration of Independence stated that governments get their power from:', options: ['The consent of the governed', 'God and the king', 'Military strength', 'Wealth and land ownership'], answer: 0, explanation: 'This was a radical idea — that governments\' power comes from the people, not from divine right of kings.' },
      { type: 'fill-blank', id: 'hist7-2-q5', grade: 7, question: 'What battle in 1781 effectively ended the Revolutionary War when the British surrendered?', answer: 'Yorktown', hint: 'Washington and French forces surrounded the British there.', explanation: 'The Battle of Yorktown ended the war. General Cornwallis surrendered to Washington in October 1781.' },
    ]
  },

  {
    id: 'history-7-3',
    subject: 'history', grade: 7, lessonNumber: 3,
    title: 'Ancient Civilizations: Mesopotamia and Egypt',
    intro: "Long before the United States, Rome, or even Greece — there were civilizations that invented writing, law, math, and government. Today we explore the oldest ones: Mesopotamia and Egypt.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'What is a civilization?',
        content: `A **civilization** is more than just a group of people living together. Historians say a civilization has:
• Cities (not just small villages)
• A government with organized leadership
• A system of writing
• Specialized jobs (not everyone farms)
• Trade and an economy
• Organized religion or shared beliefs

The earliest civilizations formed near rivers — because rivers provided water for crops, transportation, and fertile soil from floods.`
      },
      {
        type: 'explain',
        heading: 'Mesopotamia: The Land Between Two Rivers',
        content: `**Mesopotamia** (modern-day Iraq) means "land between the rivers" in Greek — specifically the **Tigris** and **Euphrates** rivers.

Around **3500 BCE**, the **Sumerians** built the world's first true cities here, including Ur and Uruk.

Sumerian achievements:
• **Cuneiform** — the world's first writing system (pressed into clay tablets)
• **The wheel** — invented around 3500 BCE
• **Irrigation** — systems to bring river water to dry farmland
• **The first code of laws** — **Hammurabi's Code** (around 1754 BCE), Babylonian king

Hammurabi's Code is famous for "an eye for an eye" justice — punishments matched the crime. It's one of the earliest written legal codes in history.`
      },
      {
        type: 'explain',
        heading: 'Ancient Egypt: Gift of the Nile',
        content: `**Ancient Egypt** flourished along the **Nile River** in northeastern Africa from about **3100 BCE** onward — over 3,000 years of continuous civilization.

The Greek historian Herodotus called Egypt "the gift of the Nile" — and he was right. The Nile flooded every year, leaving behind incredibly rich soil for farming.

Key features of Egyptian civilization:
• **Pharaohs** — god-kings who ruled with absolute power
• **Hieroglyphics** — a writing system using pictures and symbols
• **Pyramids** — built as tombs for pharaohs; the Great Pyramid at Giza (built ~2560 BCE) is still one of the largest structures ever built
• **Mummification** — preserving bodies for the afterlife
• **Papyrus** — an early form of paper made from reed plants`
      },
      {
        type: 'example',
        heading: 'The Pyramids: How and Why?',
        content: `The **Great Pyramid of Giza** was built for Pharaoh **Khufu** around 2560 BCE.

Facts that still amaze people today:
• Made of **2.3 million stone blocks**, each weighing 2.5 to 15 tons
• Stood as the tallest human-made structure for **3,800 years**
• Built without modern machinery — only ramps, sleds, and human labor
• Aligned almost perfectly with true north

**Why build pyramids?**
Egyptians believed pharaohs were gods in human form. When they died, they needed a monument worthy of a god — and a protected place for their body to rest for eternity.

The pyramids were also a display of Egypt's wealth and power. "Look what we can do."

Modern historians believe the builders were **paid workers**, not slaves — recent discoveries show workers' villages with decent food and medical care.`
      },
      {
        type: 'explain',
        heading: 'Comparing the Two Civilizations',
        content: `| Feature | Mesopotamia | Egypt |
|---------|-------------|-------|
| Location | Tigris & Euphrates rivers (modern Iraq) | Nile River (modern Egypt) |
| Writing | Cuneiform (clay tablets) | Hieroglyphics (papyrus, stone) |
| Government | City-states with kings | Unified under pharaohs (god-kings) |
| Religion | Many gods; gods could be angry | Many gods; pharaoh was a god |
| Famous for | First writing, wheel, law codes | Pyramids, mummies, sphinx |
| Started | ~3500 BCE | ~3100 BCE |

Both civilizations show us that when humans settle near rivers and learn to farm efficiently, they have surplus food — and surplus food means some people can specialize in other things like art, writing, government, and building.`
      },
    ],
    practice: [
      { type: 'multiple-choice', id: 'hist7-3-q1', grade: 7, question: 'What does "Mesopotamia" mean?', options: ['Land between the rivers', 'Land of the pharaohs', 'Home of the gods', 'River of life'], answer: 0, explanation: 'Mesopotamia is a Greek word meaning "land between the rivers" — the Tigris and Euphrates.' },
      { type: 'fill-blank', id: 'hist7-3-q2', grade: 7, question: 'What was the world\'s first writing system, invented by the Sumerians?', answer: 'cuneiform', hint: 'It was pressed into clay tablets using a wedge-shaped tool.', explanation: 'Cuneiform was the world\'s first writing system, developed by the Sumerians around 3200 BCE.' },
      { type: 'multiple-choice', id: 'hist7-3-q3', grade: 7, question: 'Why was the Nile River so important to ancient Egypt?', options: ['Its annual floods left behind rich soil perfect for farming', 'It provided fish as the main food source', 'It protected Egypt from all invaders', 'It was used only for transportation'], answer: 0, explanation: 'The Nile\'s annual floods deposited nutrient-rich silt, making the surrounding land incredibly fertile. This is why Herodotus called Egypt "the gift of the Nile."' },
      { type: 'multiple-choice', id: 'hist7-3-q4', grade: 7, question: 'What was the primary purpose of the Egyptian pyramids?', options: ['Tombs for pharaohs', 'Temples for worship', 'Grain storage', 'Palaces for the living pharaoh'], answer: 0, explanation: 'Pyramids were built as elaborate tombs. Egyptians believed pharaohs needed a grand resting place to ensure their journey to the afterlife.' },
      { type: 'fill-blank', id: 'hist7-3-q5', grade: 7, question: 'What Babylonian king created one of the world\'s first written legal codes?', answer: 'Hammurabi', hint: 'His code is famous for "an eye for an eye."', explanation: "Hammurabi's Code (around 1754 BCE) is one of the oldest written legal codes. It established that punishments should match crimes." },
    ]
  },

  {
    id: 'history-7-4',
    subject: 'history', grade: 7, lessonNumber: 4,
    title: 'Ancient Greece: Democracy and Ideas That Shaped the World',
    intro: "The ancient Greeks gave us democracy, philosophy, the Olympics, and some of the greatest thinkers who ever lived. Their ideas are still shaping the world you live in right now.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'City-States: Greece\'s Unusual Structure',
        content: `Ancient Greece wasn't one unified country — it was a collection of hundreds of independent **city-states** (called *poleis*).

Each city-state had its own government, laws, army, and culture. The two most famous were:

**Athens** — known for art, philosophy, trade, and **democracy**
**Sparta** — known for its fierce military culture; boys began military training at age 7

This setup created constant competition — and sometimes war — between city-states. But it also drove incredible innovation, because each city tried to outdo the others.`
      },
      {
        type: 'explain',
        heading: 'The Birth of Democracy',
        content: `Around **507 BCE**, an Athenian leader named **Cleisthenes** introduced a radical new idea: **democracy** — rule by the people (from Greek: *demos* = people, *kratos* = power).

In Athens, **male citizens** could vote on laws and elect leaders directly. This was **direct democracy** — citizens voted on everything themselves, not through representatives.

Important limits: women, enslaved people, and foreigners could NOT vote. So it wasn't democracy the way we think of it today. But it was revolutionary compared to kings and tyrants.

The idea that ordinary people should have a say in their government spread from Athens and eventually influenced:
• The Roman Republic
• The Magna Carta
• The U.S. Constitution
• Modern democracies worldwide`
      },
      {
        type: 'explain',
        heading: 'Greek Philosophers',
        content: `**Philosophy** means "love of wisdom." Greek philosophers asked big questions and tried to answer them with reason instead of just myth.

The three most famous:

**Socrates** (~470–399 BCE)
• Taught by asking questions (the "Socratic method")
• Believed wisdom begins with admitting what you don't know
• Executed by Athens for "corrupting the youth" with his ideas

**Plato** (428–348 BCE)
• Socrates' student
• Wrote *The Republic* — ideas about the ideal society and government
• Founded the Academy, one of the first universities

**Aristotle** (384–322 BCE)
• Plato's student
• Wrote about logic, biology, ethics, politics, and more
• Tutored **Alexander the Great**
• His ideas dominated Western thought for 1,500 years`
      },
      {
        type: 'example',
        heading: 'Greek Achievements That Still Affect You',
        content: `Greek contributions you encounter today:

**Mathematics**
• Pythagoras gave us the Pythagorean theorem (a² + b² = c²)
• Euclid wrote *Elements* — the geometry textbook used for 2,000 years

**Science & Medicine**
• Hippocrates — father of medicine; doctors still take the "Hippocratic Oath"
• Archimedes — discovered principles of buoyancy and levers

**Architecture**
• Columns, domes, and the design of the Parthenon influenced buildings from Washington D.C. to courthouses everywhere

**The Olympics**
• First held in 776 BCE in Olympia; athletes competed to honor Zeus

**Theater**
• Greeks invented both tragedy and comedy; Shakespeare and modern movies follow their dramatic structures

**The Alphabet**
• The Greek alphabet formed the basis for the Latin alphabet — which became our English alphabet`
      },
      {
        type: 'explain',
        heading: 'Alexander the Great: Spreading Greek Culture',
        content: `**Alexander the Great** (356–323 BCE) was a Macedonian king who conquered one of the largest empires in ancient history — from Greece all the way to India — in just 13 years.

He never lost a battle.

But more important than conquest was what happened after: Alexander spread Greek language, art, architecture, and ideas across his empire. This cultural blending became known as **Hellenism** (from "Hellenes" — what Greeks called themselves).

Cities he founded (he named over 20 cities "Alexandria") became centers of learning. The most famous — **Alexandria, Egypt** — housed the **Library of Alexandria**, one of the greatest collections of knowledge in the ancient world.

Alexander died at age 32. His empire split apart — but Greek culture had already taken deep root across three continents.`
      },
    ],
    practice: [
      { type: 'multiple-choice', id: 'hist7-4-q1', grade: 7, question: 'What does "democracy" mean in Greek?', options: ['Rule by the people', 'Rule by the wise', 'Rule by the strong', 'Rule by the gods'], answer: 0, explanation: 'Democracy comes from Greek: demos (people) + kratos (power/rule). It means the people hold power.' },
      { type: 'multiple-choice', id: 'hist7-4-q2', grade: 7, question: 'Which Greek philosopher was known for teaching by asking questions?', options: ['Socrates', 'Plato', 'Aristotle', 'Pythagoras'], answer: 0, explanation: 'Socrates developed the "Socratic method" — teaching through probing questions rather than lectures.' },
      { type: 'fill-blank', id: 'hist7-4-q3', grade: 7, question: 'What Greek mathematician gave us the theorem a² + b² = c²?', answer: 'Pythagoras', hint: 'The theorem is named after him.', explanation: 'Pythagoras developed his famous theorem about right triangles, still used in geometry today.' },
      { type: 'multiple-choice', id: 'hist7-4-q4', grade: 7, question: 'What was significant about Alexander the Great\'s conquests beyond just military victory?', options: ['He spread Greek language and culture across his empire', 'He established democracy everywhere he conquered', 'He built the largest army ever assembled', 'He conquered Rome'], answer: 0, explanation: 'Alexander spread Greek culture (Hellenism) across three continents — language, art, architecture, and ideas — creating a lasting cultural legacy far beyond his military victories.' },
      { type: 'multiple-choice', id: 'hist7-4-q5', grade: 7, question: 'Which ancient Greek city-state was known for its military culture, where boys began training at age 7?', options: ['Sparta', 'Athens', 'Corinth', 'Thebes'], answer: 0, explanation: 'Sparta was famous for its military culture. Spartan boys left home at 7 to begin rigorous military training.' },
    ]
  },

  {
    id: 'history-7-5',
    subject: 'history', grade: 7, lessonNumber: 5,
    title: 'The U.S. Constitution: How America\'s Government Was Built',
    intro: "The Constitution is the rulebook for the United States government — and it's been running the country for over 230 years. Today we're going to understand how it works, why it was designed the way it was, and why the founders were so worried about one person having too much power.",
    streakNeeded: 3,
    steps: [
      {
        type: 'explain',
        heading: 'The Problem: Articles of Confederation',
        content: `After winning independence, the United States needed a government. Their first attempt — the **Articles of Confederation** (1781) — was a disaster.

Why? The founders were so scared of powerful government (like the king they just fought) that they made the national government almost powerless:
• Congress couldn't tax citizens
• Congress couldn't enforce its own laws
• States could ignore national laws
• No president, no national courts

The result was chaos. States were fighting each other over trade. The national government couldn't pay its debts. In 1786, **Shays' Rebellion** — farmers revolting in Massachusetts — showed the government couldn't even keep order.

Something had to change.`
      },
      {
        type: 'explain',
        heading: 'The Constitutional Convention (1787)',
        content: `In May 1787, delegates from 12 states gathered in Philadelphia to fix the Articles of Confederation. They ended up scrapping it entirely and writing a completely new document.

Key figures:
• **James Madison** — "Father of the Constitution," did most of the planning
• **George Washington** — presided over the convention; his presence gave it legitimacy
• **Benjamin Franklin** — oldest delegate (81); helped broker compromises
• **Alexander Hamilton** — pushed hard for a strong national government

The central debate: **How much power should the national government have vs. the states?**

Big states vs. small states: How should states be represented in Congress?
→ **The Great Compromise**: Two chambers — Senate (equal representation: 2 per state) and House (representation by population)`
      },
      {
        type: 'explain',
        heading: 'Separation of Powers',
        content: `The founders were obsessed with preventing tyranny (when one person or group has too much power). Their solution: **separation of powers**.

The Constitution created **three branches** of government:

**Legislative Branch (Congress)**
• Makes the laws
• Two chambers: Senate + House of Representatives

**Executive Branch (President)**
• Carries out the laws
• Commands the military
• Conducts foreign policy

**Judicial Branch (Supreme Court)**
• Interprets the laws
• Decides if laws are constitutional

Each branch has power to **check** (limit) the others — this is called **checks and balances**. No single branch can become too powerful.`
      },
      {
        type: 'example',
        heading: 'Checks and Balances in Action',
        content: `Here's how each branch checks the others:

**Congress checks the President:**
• Can override a presidential veto with a 2/3 vote
• Senate must approve treaties and major appointments
• Can impeach (remove) the president

**President checks Congress:**
• Can veto (reject) laws passed by Congress
• Nominates Supreme Court justices

**Supreme Court checks both:**
• Can declare laws unconstitutional (**judicial review**)
• Justices serve for life — not controlled by elections

**Real example:**
President Biden proposed legislation. Congress passed it. If someone challenged it in court, the Supreme Court could strike it down if it violates the Constitution.

That three-way tug-of-war is working exactly as designed.`
      },
      {
        type: 'explain',
        heading: 'The Bill of Rights',
        content: `Many states refused to ratify the Constitution without a guarantee of individual rights. So in 1791, the first **10 amendments** (changes) were added — called the **Bill of Rights**.

Key ones to know:

**1st Amendment** — Freedom of speech, religion, press, and peaceful assembly
**2nd Amendment** — Right to bear arms
**4th Amendment** — Protection against unreasonable searches
**5th Amendment** — Right to remain silent (not testify against yourself)
**6th Amendment** — Right to a fair and speedy trial

The Bill of Rights limits what the government can do TO you. It protects individual freedoms from government overreach.

Today there are **27 amendments** total. The most recent was ratified in 1992 — almost 200 years after it was proposed.`
      },
    ],
    practice: [
      { type: 'multiple-choice', id: 'hist7-5-q1', grade: 7, question: 'Why did the Articles of Confederation fail?', options: ['The national government was too weak — it couldn\'t tax or enforce laws', 'The president had too much power', 'States had no rights', 'It was never officially approved'], answer: 0, explanation: 'The Articles made the national government nearly powerless — it couldn\'t collect taxes, enforce laws, or maintain order. Shays\' Rebellion exposed how broken the system was.' },
      { type: 'multiple-choice', id: 'hist7-5-q2', grade: 7, question: 'Which branch of government makes the laws?', options: ['Legislative (Congress)', 'Executive (President)', 'Judicial (Supreme Court)', 'All three equally'], answer: 0, explanation: 'The Legislative Branch — Congress (Senate + House of Representatives) — is responsible for making laws.' },
      { type: 'fill-blank', id: 'hist7-5-q3', grade: 7, question: 'What do we call the system where each branch of government has power to limit the others?', answer: 'checks and balances', hint: 'It prevents any one branch from becoming too powerful.', explanation: 'Checks and balances ensure that no single branch of government can accumulate too much power.' },
      { type: 'multiple-choice', id: 'hist7-5-q4', grade: 7, question: 'What is the Bill of Rights?', options: ['The first 10 amendments, protecting individual freedoms', 'The original Constitution document', 'A list of citizens\' duties', 'The rules for electing a president'], answer: 0, explanation: 'The Bill of Rights is the first 10 amendments to the Constitution, added in 1791 to protect individual freedoms from government overreach.' },
      { type: 'fill-blank', id: 'hist7-5-q5', grade: 7, question: 'Which amendment protects freedom of speech, religion, and the press?', answer: '1st', hint: 'It\'s the very first one.', explanation: 'The 1st Amendment protects freedom of speech, religion, press, and peaceful assembly — some of the most fundamental rights in the Constitution.' },
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WRITING GRADE 5 — additional lessons (paper-based)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'writing-5-3',
    subject: 'writing', grade: 5, lessonNumber: 3,
    title: 'Cursive Refresher: Connecting Letters Into Words',
    intro: "You already know how to write cursive letters — now we're going to focus on the part that trips a lot of people up: connecting them smoothly into words. Once you get the flow, cursive actually feels faster and easier than printing.",
    streakNeeded: 3,
    paperBased: true,
    paperAssignment: `**Cursive Practice — Connecting Letters**

Read through the lesson, then complete these practice activities on paper in your best cursive:

**Part 1 — Warm-up strokes (2 lines each):**
Write these joining strokes repeatedly to warm up your hand:
- ou  ow  or  of  ot
- an  in  un  en  on
- st  nd  ld  ll  tt

**Part 2 — Practice words (write each word 3 times in cursive):**
- the, and, was, that, with
- have, this, they, from, word
- your, when, there, which, some

**Part 3 — Connecting challenge (write each phrase 2 times):**
- my name is Mathias
- I like to learn
- today is a good day
- the sun is shining bright

**Part 4 — Sentence (copy once, then write from memory):**
"Learning cursive takes practice, but once it flows it feels natural."

Show your parent when you're done! 📝`,
    steps: [
      {
        type: 'explain',
        heading: 'Why connecting letters feels hard',
        content: `When you write individual cursive letters, you lift your pencil between each one. That's fine for practice — but in real cursive writing, letters **connect** to each other without lifting.

The tricky part: different letters connect differently depending on where they end.

Letters that end at the **bottom** (a, c, d, e, h, i, k, l, m, n, u, x, z) → connect by sliding forward along the baseline

Letters that end at the **top** (b, o, v, w) → connect by a small loop or curve going down to meet the next letter

Once you know which group a letter belongs to, the connections get much easier.`
      },
      {
        type: 'example',
        heading: 'The most common connections',
        content: `Let's look at the most common letter pairs in English:

**"th" connection** — t ends at the top, h starts at the bottom. The t's cross-stroke leads right into the h.
Practice: the, that, then, with, they, this

**"an" connection** — a ends at bottom, slides smoothly into n.
Practice: and, can, man, hand, plant, than

**"ou" and "ow" connection** — o ends at top, curves down into u or w.
Practice: out, our, down, town, you, your

**"in" and "on" connection** — i and o both connect easily to n.
Practice: in, on, into, one, only, until

**Double letters** — ll, tt, ss, ff: write the first, continue the stroke directly into the second.
Practice: will, tell, little, off, miss, across`
      },
      {
        type: 'tip',
        heading: '✍️ Tips for smooth connected cursive',
        content: `**Keep your pencil moving.** The #1 mistake is pausing between letters. Cursive should flow — slow and steady, not fast and jerky.

**Stay on the baseline.** All letters should sit on the line. Connections that drift up or down look messy.

**Don't press too hard.** Light pressure = more fluid movement. Heavy pressing makes your hand tire out and your letters look stiff.

**Tilt your paper.** Most people find cursive easier with the paper tilted slightly (right-handed: tilt left; left-handed: tilt right).

**Go slow at first.** Speed comes naturally after the movements become familiar. Right now, focus on correct form.`
      },
      {
        type: 'explain',
        heading: 'The secret to cursive words feeling natural',
        content: `Here's something that helped a lot of people: **stop thinking about letters and start thinking about words as shapes.**

When you see the word "the" in cursive, don't think "t… then h… then e." Instead, train your hand to recognize "the" as one flowing shape.

The way you get there: **repetition**. Write the same word over and over until your hand knows the shape.

Start with the 20 most common words in English:
the, and, a, to, in, is, you, that, it, he,
was, for, on, are, as, with, his, they, I, at

If your hand knows these words automatically, you'll be able to write most sentences in cursive without thinking hard about connections at all.`
      },
    ],
    practice: [
      {
        type: 'multiple-choice', id: 'wri5-3-q1', grade: 5,
        question: 'In cursive writing, what is the main difference from printing?',
        options: ['Letters connect to each other without lifting the pencil between them', 'You write faster by skipping some letters', 'Each letter is written separately', 'You only use capital letters'],
        answer: 0,
        explanation: 'Cursive connects letters into a flowing word — you lift your pencil at the end of the word, not between every letter.'
      },
      {
        type: 'multiple-choice', id: 'wri5-3-q2', grade: 5,
        question: 'What is the #1 tip for smooth cursive connections?',
        options: ['Keep your pencil moving — don\'t pause between letters', 'Press harder so letters are clear', 'Write as fast as possible', 'Lift your pencil between every letter to reset'],
        answer: 0,
        explanation: 'Pausing between letters breaks the flow. Cursive should be one continuous motion through the whole word.'
      },
      {
        type: 'fill-blank', id: 'wri5-3-q3', grade: 5,
        question: 'Instead of thinking letter by letter, what should you train your hand to recognize?',
        answer: 'words as shapes',
        hint: 'Think of the whole word at once, not each letter separately.',
        explanation: 'Recognizing whole words as single flowing shapes is what makes cursive feel natural and fast.'
      },
    ]
  },

  {
    id: 'writing-5-4',
    subject: 'writing', grade: 5, lessonNumber: 4,
    title: 'Creative Story Writing',
    intro: "Stories are one of the oldest forms of human communication — people have been telling them around fires for thousands of years. Today you're going to learn what makes a story come alive, then write one of your own.",
    streakNeeded: 3,
    paperBased: true,
    paperAssignment: `**Creative Story Assignment**

Using what you learned in the lesson, write a creative story on paper. Your story should be **at least 2 paragraphs** (aim for a full page if you can!).

**Choose ONE of these story starters:**

1. *"The morning I woke up and discovered I could understand what animals were saying, the first thing my dog told me was..."*

2. *"Nobody in town believed the old lighthouse was haunted — until the night Mathias stayed there alone and heard..."*

3. *"The map was old and crinkled, but the X marked a spot only three miles from here. I grabbed my backpack and..."*

**Your story MUST include:**
- [ ] A main character (give them a name and at least one personality trait)
- [ ] A clear problem or challenge they face
- [ ] At least ONE descriptive detail using your senses (what you see, hear, smell, or feel)
- [ ] A moment of action or excitement
- [ ] An ending (it doesn't have to be happy — just resolved)

**Bonus:** Try using dialogue (someone talking) — put it in quotation marks!

Write in your best cursive. Show your parent when you're done! 📝`,
    steps: [
      {
        type: 'explain',
        heading: 'Every good story needs these things',
        content: `Stories — from ancient myths to modern movies — all share the same basic ingredients:

**1. Character** — someone we care about. The reader needs to feel something about them.

**2. Setting** — where and when the story takes place. Set the scene!

**3. Problem (Conflict)** — something goes wrong, a challenge appears, a mystery needs solving. Without a problem, nothing happens and the story is boring.

**4. Rising action** — things get more complicated. The character tries to solve the problem.

**5. Climax** — the most exciting moment; the turning point.

**6. Resolution** — how it ends. The problem is solved (or not) and we see how the character has changed.

You don't need all of these to be huge and dramatic. A short story can have a small problem and a quiet resolution — what matters is that it feels complete.`
      },
      {
        type: 'explain',
        heading: 'Show, don\'t tell',
        content: `The most powerful writing tip: **show, don't tell**.

**Telling:** "Maya was scared."
**Showing:** "Maya's hands trembled. She pressed her back against the wall and held her breath, listening."

See how "showing" makes you feel the fear instead of just being told about it?

**Telling:** "It was a hot day."
**Showing:** "The sidewalk shimmered in the heat, and even the birds had gone quiet."

**Telling:** "He was angry."
**Showing:** "He slammed the door so hard the windows rattled."

When you write, ask yourself: *Can I show this with an action, a detail, or a physical sensation instead of just naming the feeling?*`
      },
      {
        type: 'example',
        heading: 'Building a character quickly',
        content: `You don't need a whole chapter to make a character feel real. A few sharp details do the job.

Compare these two character introductions:

❌ **Weak:** "There was a boy named Sam. He was nice and liked adventure."

✅ **Strong:** "Sam always had dirt on his sneakers and a half-finished granola bar in his pocket. He was the kind of kid who saw a 'No Trespassing' sign and immediately wondered what was behind it."

The second one tells us Sam is adventurous and a little reckless — but it SHOWS us instead of just saying it.

**Try it yourself:** What details would tell a reader something about YOU without using the words "I am ___"?`
      },
      {
        type: 'tip',
        heading: '✍️ When you get stuck: ask "what if?"',
        content: `Every writer gets stuck. Here's the secret weapon: **"What if?"**

If your story stalls, ask:
• What if something unexpected happened right now?
• What if the character made the wrong choice?
• What if someone showed up who changes everything?
• What if the problem got worse before it got better?

The "what if" question is how writers push past stuck moments and find the interesting path forward.

Also remember: **your first draft doesn't have to be good.** It just has to exist. You can fix it later. Get the story out of your head and onto the paper first.`
      },
    ],
    practice: [
      {
        type: 'multiple-choice', id: 'wri5-4-q1', grade: 5,
        question: 'What is the CLIMAX of a story?',
        options: ['The most exciting moment — the turning point of the problem', 'The very beginning where characters are introduced', 'The ending where everything is resolved', 'A descriptive paragraph about the setting'],
        answer: 0,
        explanation: 'The climax is the peak moment of tension — the most exciting or critical point, where the main conflict reaches its highest point before things start to resolve.'
      },
      {
        type: 'multiple-choice', id: 'wri5-4-q2', grade: 5,
        question: 'Which sentence SHOWS rather than tells?',
        options: ['"Her voice cracked when she spoke and she couldn\'t meet his eyes."', '"She was nervous."', '"Emma felt really embarrassed."', '"It was an awkward situation."'],
        answer: 0,
        explanation: 'Showing uses specific actions and physical details to let the reader experience the emotion. The others just name the feeling (telling).'
      },
      {
        type: 'fill-blank', id: 'wri5-4-q3', grade: 5,
        question: 'What two-word question should you ask yourself when your story gets stuck?',
        answer: 'what if',
        hint: 'It helps you find unexpected directions for your story.',
        explanation: '"What if?" pushes your story in new directions and helps you break through writer\'s block by opening up possibilities.'
      },
    ]
  },

  {
    id: 'writing-5-5',
    subject: 'writing', grade: 5, lessonNumber: 5,
    title: 'Journal Writing: Your Voice, Your Life',
    intro: "A journal is one of the best writing tools there is — and the coolest part? There's no wrong way to do it. Today we're learning how to use journal writing to get better at putting your thoughts and feelings into words.",
    streakNeeded: 3,
    paperBased: true,
    paperAssignment: `**Journal Entry Assignment**

Write a journal entry on paper. There is no right or wrong here — just write honestly and freely.

**Your entry should be at least ONE full paragraph** (5–8 sentences). Longer is great!

**Choose a prompt that interests you most:**

1. **"The best day I can remember"** — Describe it in detail. What happened? Who was there? What did it feel, smell, sound, or look like? Why does it stick in your memory?

2. **"Something I wish more people understood about me"** — What's something true about you that people don't always see or know? Why does it matter to you?

3. **"A place that feels like mine"** — Describe a place (real or imagined) where you feel most comfortable or most like yourself. What makes it special?

4. **"If I could change one thing"** — What would you change about the world, your life, or your situation — and why? What would be different if that change happened?

**Tips for this entry:**
- Write in first person (I, me, my)
- Don't worry about being perfect — just be honest
- Use specific details (not "it was fun" but HOW it was fun)
- Write in cursive

Show your parent when finished! 📝`,
    steps: [
      {
        type: 'explain',
        heading: 'What makes a journal different from other writing',
        content: `Journal writing has a superpower: **it's just for you.**

There's no audience to impress, no grade to earn, no perfect format to follow. The journal is where you figure out what you actually think and feel — by writing it down.

This matters because writing doesn't just record your thoughts. It actually **creates** new thoughts. When you write about something, you often understand it better than before you started.

Famous writers, scientists, presidents, and artists all kept journals. Not because they were told to — because they found it useful.

Some used it to process hard experiences. Some used it to capture ideas before they forgot them. Some used it just to feel less alone with their thoughts. Any of those reasons is valid.`
      },
      {
        type: 'explain',
        heading: 'The rules of journal writing',
        content: `There is exactly one rule: **write honestly.**

Everything else is optional.

But here are some guidelines that make journal writing more satisfying:

• **Be specific.** "I had a good day" tells you nothing in a year. "I finally landed the trick I'd been practicing for two weeks and Marcus saw it happen" — that's a memory.

• **Write about feelings AND what caused them.** Not just "I was frustrated" but "I was frustrated because no matter how many times I explained it, the answer just wouldn't click — and I hate that feeling."

• **No censoring.** If you think it, you can write it. Nobody needs to read this but you.

• **Don't worry about grammar.** This is the ONE place where you can write run-on sentences and fragments and whatever feels natural.`
      },
      {
        type: 'tip',
        heading: '✍️ How to get started when your mind feels blank',
        content: `The blank page is the hardest part. Here are ways to break through:

**Start with right now.** "Right now I'm sitting at the table and I'm supposed to be writing but I'm not sure what to say..." Just describe what's actually happening — that often unlocks other thoughts.

**Use a sentence starter:**
- "The thing I keep thinking about lately is..."
- "I've been wondering why..."
- "Something that surprised me recently was..."
- "If I'm being honest..."

**Write for time, not length.** Set a goal of "I'll write for 5 minutes" rather than "I'll write a page." Keep your pen moving for the whole time, even if what comes out feels silly.

These tricks work. Try them.`
      },
      {
        type: 'explain',
        heading: 'Journals as a writing practice tool',
        content: `Here's something great: regular journal writing makes ALL your writing better.

Why? Because it builds the habit of turning thoughts into sentences. It gets rid of the fear of the blank page. It helps you discover your own voice — the way you naturally express yourself.

Your "voice" is the style and personality that comes through in your writing. It's what makes your writing sound like YOU and not anyone else.

Journals are where your voice lives. The more you write, the clearer and stronger your voice gets — and that voice will show up in your essays, stories, and everything else.

A lot of writers say the journal is where they do their best thinking.`
      },
    ],
    practice: [
      {
        type: 'multiple-choice', id: 'wri5-5-q1', grade: 5,
        question: 'What is the most important "rule" of journal writing?',
        options: ['Write honestly', 'Use perfect grammar', 'Write at least one page every time', 'Always write about happy things'],
        answer: 0,
        explanation: 'Honesty is the one real rule of journaling. Everything else — length, grammar, format — is secondary to just writing what\'s true for you.'
      },
      {
        type: 'multiple-choice', id: 'wri5-5-q2', grade: 5,
        question: 'Why are specific details better than vague statements in a journal?',
        options: ['Specific details capture real memories; vague statements mean nothing when you read them later', 'Specific details are easier to write', 'Teachers grade journals on details', 'Vague statements are more poetic'],
        answer: 0,
        explanation: '"I had a good day" tells you nothing a year later. Specific details preserve the actual memory and feeling of the moment.'
      },
      {
        type: 'fill-blank', id: 'wri5-5-q3', grade: 5,
        question: 'What do we call the personal style and personality that comes through in your writing?',
        answer: 'voice',
        hint: 'It\'s what makes your writing sound like YOU.',
        explanation: 'Your writing "voice" is your unique style and personality on the page. Journaling is one of the best ways to develop it.'
      },
    ]
  },

  {
    id: 'writing-5-6',
    subject: 'writing', grade: 5, lessonNumber: 6,
    title: 'Essay Structure: Introduction, Body, Conclusion',
    intro: "An essay is just an organized way to share an opinion or idea with a reader. Once you know the structure, you can write about almost anything. Today we're learning the format that every essay follows — from school assignments to newspaper columns to books.",
    streakNeeded: 3,
    paperBased: true,
    paperAssignment: `**Five-Paragraph Essay Assignment**

Write a five-paragraph essay on paper using the structure from the lesson.

**Your topic:** *"What is the most important skill a person can learn, and why?"*

Examples of possible answers: reading, communication, problem-solving, being kind, learning how to learn — or any skill you think matters most.

**Your essay MUST include:**

**Paragraph 1 — Introduction:**
- [ ] An opening hook (question, surprising fact, or bold statement)
- [ ] 2–3 sentences of background
- [ ] A thesis statement (your main argument in one sentence)

**Paragraphs 2, 3, 4 — Body (one reason per paragraph):**
- [ ] Topic sentence (states the reason)
- [ ] 2–3 supporting details or examples
- [ ] Closing sentence for the paragraph

**Paragraph 5 — Conclusion:**
- [ ] Restate your thesis in new words
- [ ] Briefly summarize your three reasons
- [ ] A strong closing sentence (end with something memorable)

**Before you write, plan it out:**
On a separate sheet, write your thesis and your three reasons. Then write the essay.

Write in cursive. Show your parent when done! 📝`,
    steps: [
      {
        type: 'explain',
        heading: 'The basic essay structure',
        content: `Almost every essay follows this structure:

**Introduction** (Paragraph 1)
→ Grabs the reader's attention, gives background, ends with your thesis

**Body Paragraphs** (Paragraphs 2, 3, 4)
→ Each one makes ONE point that supports your thesis, with evidence and explanation

**Conclusion** (Paragraph 5)
→ Restates your thesis, summarizes your points, ends memorably

This is called a **five-paragraph essay**. It's the foundation of almost all academic writing. Once you master this, longer essays are just more body paragraphs.`
      },
      {
        type: 'explain',
        heading: 'The Introduction: Hook, Background, Thesis',
        content: `Your introduction has three jobs:

**1. The Hook** — grab the reader's attention in the first sentence.
Options:
• Ask a surprising question: "What if everything you knew about learning was wrong?"
• Share a surprising fact: "The average person makes over 35,000 decisions every single day."
• Make a bold statement: "The most important skill in the world isn't reading, writing, or math."

**2. Background** — 2–3 sentences giving context. What's this essay about? Why does it matter?

**3. Thesis statement** — ONE sentence that states your main argument. This is the most important sentence in your essay.

Example thesis: "Problem-solving is the most important skill a person can develop because it applies to every area of life, builds confidence, and never becomes outdated."

Notice how that thesis has THREE reasons built in — those will become your three body paragraphs.`
      },
      {
        type: 'example',
        heading: 'What a strong thesis looks like',
        content: `A weak thesis just states a topic:
❌ "This essay is about exercise."
❌ "Exercise is good for you."

A strong thesis makes a CLAIM and hints at the reasons:
✅ "Regular exercise improves physical health, mental well-being, and academic performance — making it one of the most valuable habits a student can build."

✅ "Reading is the single most important skill because it unlocks every other subject, builds vocabulary automatically, and develops empathy."

Test your thesis with this question: **"So what? Why does this matter?"**
If your thesis already answers that question, it's strong.
If someone could respond "okay, and?" — you need to be more specific.`
      },
      {
        type: 'explain',
        heading: 'Body Paragraphs: One point each',
        content: `Each body paragraph makes ONE point from your thesis and backs it up.

Structure:
1. **Topic sentence** — state the point clearly
2. **Evidence/Example** — prove it with facts, examples, or experiences
3. **Explanation** — explain WHY this evidence supports your thesis
4. **Transition** — connect to the next paragraph

Example body paragraph:
"First, reading builds vocabulary automatically. When you read regularly, you encounter new words in context — and context teaches meaning better than memorizing definitions. A student who reads for 20 minutes a day will encounter thousands more words per year than one who doesn't. This expanded vocabulary helps in every other subject, from science to history to math word problems."

Notice: topic sentence → evidence → explanation. That's the formula.`
      },
      {
        type: 'explain',
        heading: 'The Conclusion: Wrap it up memorably',
        content: `The conclusion does three things:

**1. Restate your thesis** — in NEW words. Don't copy-paste it. Show that you've made your point.

**2. Summarize your main points** — briefly remind the reader of your three reasons.

**3. Closing statement** — end with something that sticks. Options:
• A call to action: "The next time you pick up a book, remember..."
• A big-picture connection: "In a world that changes fast, the skills that last are..."
• A return to your hook: connect back to the question or statement you opened with

**What NOT to do in a conclusion:**
• Don't introduce new ideas
• Don't say "In conclusion, I have shown that..." (weak and obvious)
• Don't just repeat your introduction word for word

The conclusion is your last impression on the reader. Make it count.`
      },
    ],
    practice: [
      {
        type: 'multiple-choice', id: 'wri5-6-q1', grade: 5,
        question: 'What is a thesis statement?',
        options: ['One sentence that states your main argument and hints at your reasons', 'The first sentence of your essay', 'A list of all the points you will make', 'The last sentence of your conclusion'],
        answer: 0,
        explanation: 'A thesis statement is one sentence — usually at the end of the introduction — that makes your central claim and often previews your main reasons.'
      },
      {
        type: 'multiple-choice', id: 'wri5-6-q2', grade: 5,
        question: 'How many main points should each body paragraph make?',
        options: ['One', 'Two or three', 'As many as possible', 'The same as the other paragraphs'],
        answer: 0,
        explanation: 'Each body paragraph focuses on exactly ONE point. This keeps paragraphs focused and easy to follow. Three body paragraphs = three separate points.'
      },
      {
        type: 'fill-blank', id: 'wri5-6-q3', grade: 5,
        question: 'What do we call the opening sentence of an essay that grabs the reader\'s attention?',
        answer: 'hook',
        hint: 'It "hooks" the reader in.',
        explanation: 'A hook is the opening sentence designed to grab attention — a surprising question, bold statement, or striking fact.'
      },
      {
        type: 'multiple-choice', id: 'wri5-6-q4', grade: 5,
        question: 'What should you NOT do in a conclusion?',
        options: ['Introduce brand-new ideas not mentioned in the essay', 'Restate your thesis in new words', 'Summarize your main points', 'End with a memorable closing statement'],
        answer: 0,
        explanation: 'Conclusions wrap up — they don\'t introduce new ideas. New information in the conclusion confuses the reader and weakens your ending.'
      },
    ]
  },
]

export function getLessonsForSubjectAndGrade(subject: Subject, grade: number): Lesson[] {
  return LESSONS.filter(l => l.subject === subject && l.grade === grade)
    .sort((a, b) => a.lessonNumber - b.lessonNumber)
}

// Returns the highest grade that has lessons for a subject, at or below the target grade
export function getHighestAvailableGrade(subject: Subject, targetGrade: number): number {
  const available = [...new Set(LESSONS.filter(l => l.subject === subject).map(l => l.grade))]
    .filter(g => g <= targetGrade)
    .sort((a, b) => b - a)
  return available[0] ?? targetGrade
}
