import { Lecture } from '../types';

export const SAMPLE_LECTURE: Lecture = {
  id: 'mit-6006-dynamic-programming',
  user_id: 'demo-user-lectura',
  title: 'Introduction to Algorithms: Dynamic Programming & Optimal Substructure',
  subject: 'Computer Science',
  exam_level: 'University / Undergraduate / GATE CS',
  preferred_language: 'English',
  difficulty: 'Intermediate',
  study_goal: 'Master DP recurrence relations, memoization tables, and time complexity proofs',
  source_type: 'youtube',
  source_url: 'https://www.youtube.com/watch?v=OQ5jsbhAv_M',
  duration_formatted: '52:18',
  status: 'completed',
  progress_percent: 100,
  status_message: 'Study kit synthesized and verified',
  created_at: '2026-09-10T14:30:00Z',
  updated_at: '2026-09-10T14:35:12Z',
  transcript: {
    id: 'trans-mit-6006',
    lecture_id: 'mit-6006-dynamic-programming',
    language: 'English',
    confidence: 0.98,
    created_at: '2026-09-10T14:31:00Z',
    full_text: `Welcome to Lecture 19 of 6.006. Today we begin dynamic programming, perhaps the most powerful algorithmic design technique you will learn in this course. Many students find DP intimidating at first because it feels like magic. But DP is not magic; DP is simply careful, clever brute force. Dynamic programming equals recursion plus memoization plus guessing. If you remember that equation, you can solve almost any DP problem. First, we look at the Fibonacci numbers. The naive recursive algorithm takes exponential time, 2 to the n over 2, because it repeatedly solves identical subproblems millions of times. When computing fib(5), it computes fib(3) twice, fib(2) three times, and so on. By introducing a memo table or dictionary, we store the result of each subproblem the very first time we solve it. When we encounter that subproblem again, we look up the answer in O(1) time. This reduces the total time from exponential O(2^(n/2)) to linear O(n). Next, we formalize the five-step DP recipe: define subproblems, guess the choice, relate subproblem solutions via recurrence, build topological order of subproblems, and solve the original problem. Let us now examine shortest paths on Directed Acyclic Graphs (DAGs) to see why acyclicity guarantees that our subproblem dependency graph is well-founded.`,
    segments: [
      {
        id: 'seg-1',
        start_seconds: 0,
        end_seconds: 184,
        timestamp: '00:00',
        text: 'Welcome to 6.006. Today we begin dynamic programming. DP is recursion plus memoization plus guessing.',
        speaker: 'Prof. Erik Demaine'
      },
      {
        id: 'seg-2',
        start_seconds: 185,
        end_seconds: 490,
        timestamp: '03:05',
        text: 'Examining Fibonacci numbers: naive recursive tree vs. memoized linear execution. Why naive recursion explodes exponentially.',
        speaker: 'Prof. Erik Demaine'
      },
      {
        id: 'seg-3',
        start_seconds: 491,
        end_seconds: 980,
        timestamp: '08:11',
        text: 'The 5-step DP Recipe: 1. Define subproblems, 2. Guess part of solution, 3. Relate subproblems, 4. Recurse & memoize (or bottom-up table), 5. Solve original.',
        speaker: 'Prof. Erik Demaine'
      },
      {
        id: 'seg-4',
        start_seconds: 981,
        end_seconds: 1620,
        timestamp: '16:21',
        text: 'Shortest paths in DAGs. Topological sorting guarantees subproblems are resolved in non-cyclical dependency order.',
        speaker: 'Prof. Erik Demaine'
      },
      {
        id: 'seg-5',
        start_seconds: 1621,
        end_seconds: 2430,
        timestamp: '27:01',
        text: 'Subproblem analysis: Number of subproblems times time spent per subproblem (excluding recursive calls) gives total time complexity.',
        speaker: 'Prof. Erik Demaine'
      },
      {
        id: 'seg-6',
        start_seconds: 2431,
        end_seconds: 3138,
        timestamp: '40:31',
        text: 'Bottom-up tabulation vs top-down memoization: stack depth implications, cache locality, and space optimization techniques.',
        speaker: 'Prof. Erik Demaine'
      }
    ]
  },
  study_kit: {
    id: 'sk-mit-6006',
    lecture_id: 'mit-6006-dynamic-programming',
    language: 'English',
    created_at: '2026-03-10T10:00:00.000Z',
    overview: 'This lecture introduces Dynamic Programming (DP) as an algorithmic paradigm that systematically replaces exponential brute-force recursion with polynomial-time solutions by caching overlapping subproblem solutions and verifying topological acyclicity.',
    missing_or_uncertain_info: [
      'The lecture does not delve into 2D grid matrix chain multiplication, which is deferred to Lecture 20.',
      'Memory stack exhaustion limits on deep recursion vary by programming language runtime.'
    ],
    notes: [
      {
        id: 'note-1',
        title: 'Core Philosophy: DP as "Careful Brute Force"',
        timestamp_ref: '00:00',
        summary: 'Dynamic programming is not an impenetrable black box; it is structured enumeration. It decomposes problems into overlapping subproblems whose solutions are computed once and reused.',
        key_points: [
          'Fundamental equation: DP = Recursion + Memoization + Guessing.',
          'Naive recursion recomputes identical subproblems exponentially often.',
          'Subproblem sharing is the necessary and sufficient condition for dynamic programming to yield speedups.'
        ],
        important_definitions: [
          {
            term: 'Dynamic Programming (DP)',
            definition: 'An algorithmic design paradigm where an optimization problem is solved by combining solutions to overlapping subproblems.'
          },
          {
            term: 'Memoization',
            definition: 'An optimization technique used primarily to speed up programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again.'
          }
        ],
        teacher_examples: [
          'Computing fib(5) recursively calls fib(3) twice and fib(2) three times, wasting massive clock cycles on identical trees.'
        ],
        formula_or_code: [
          {
            title: 'Fibonacci Recurrence Relation',
            content: 'T(n) = T(n-1) + T(n-2) + O(1) = O(2^(n/2)) [Naive]  -->  O(n) [Memoized]'
          }
        ],
        relationships: [
          'Overlapping Subproblems --> Enables Memoization',
          'Optimal Substructure --> Validates Greedy & DP recursive decompositions'
        ]
      },
      {
        id: 'note-2',
        title: 'The 5-Step Systematic DP Recipe',
        timestamp_ref: '08:11',
        summary: 'Every DP problem can be solved following a rigorous five-step template developed at MIT.',
        key_points: [
          'Step 1: Define Subproblems (count the total number of subproblems |S|).',
          'Step 2: Guess (identify the choice the algorithm must make, e.g., which edge to take).',
          'Step 3: Relate subproblem solutions (write down the recurrence relation).',
          'Step 4: Recurse & Memoize, or Tabulate (ensure the subproblem dependency graph is a DAG).',
          'Step 5: Solve original problem (combine or read the final subproblem answer).'
        ],
        teacher_examples: [
          'In text justification, the guess is: where does the next line break occur? There are at most n choices.'
        ],
        formula_or_code: [
          {
            title: 'Master DP Running Time Formula',
            content: 'Total Time = (Number of Subproblems) × (Time spent per subproblem ignoring recursive calls)'
          }
        ],
        relationships: [
          'Subproblems Count (|S|) × Time/Subproblem = Overall Complexity O(|S| · T_sub)'
        ]
      },
      {
        id: 'note-3',
        title: 'Subproblem Dependency Graph & DAGs',
        timestamp_ref: '16:21',
        summary: 'A recurrence relation is valid if and only if the subproblem dependency graph contains no directed cycles. DP is equivalent to finding shortest/longest paths on a DAG.',
        key_points: [
          'Every DP subproblem corresponds to a vertex in an implicit directed graph.',
          'A directed edge (u, v) indicates that solving subproblem u requires the answer to subproblem v.',
          'Cycles cause infinite recursive loops; acyclicity guarantees topological order exists.'
        ],
        important_definitions: [
          {
            term: 'Topological Order',
            definition: 'A linear ordering of vertices in a directed acyclic graph such that for every directed edge uv, vertex u comes before v in the ordering.'
          }
        ],
        teacher_examples: [
          'Fibonacci dependency graph: n depends on n-1 and n-2, strictly descending, forming a linear DAG with no back-edges.'
        ]
      },
      {
        id: 'note-4',
        title: 'Memoization vs. Bottom-up Tabulation',
        timestamp_ref: '40:31',
        summary: 'Comparison of top-down recursive caching versus bottom-up iterative table construction.',
        key_points: [
          'Top-down (Memoization): Easy to write, computes only reachable subproblems, but incurs call stack overhead.',
          'Bottom-up (Tabulation): Iterates topologically through a table, eliminating call stack limits and enabling memory reduction.',
          'Space optimization: In Fibonacci, because fib(i) only depends on fib(i-1) and fib(i-2), space can be reduced from O(n) to O(1).'
        ]
      }
    ],
    concept_explanations: [
      {
        id: 'concept-1',
        concept_name: 'Optimal Substructure',
        what_it_means: 'A problem exhibits optimal substructure if an optimal solution to the overall problem contains within it optimal solutions to subproblems.',
        why_it_matters: 'Without optimal substructure, you cannot build the global optimum by composing local subproblem optimums; DP fails if subproblems interfere with one another.',
        step_by_step: [
          'Identify candidate subproblems that represent a prefix, suffix, or substring.',
          'Assume an optimal solution to the parent problem.',
          'Prove by contradiction: if the sub-solution were suboptimal, replacing it with a superior sub-solution would strictly improve the parent solution (cut-and-paste proof).'
        ],
        lecture_example: 'In shortest path from S to T through vertex V, the path from S to V must be the shortest possible path between S and V.',
        common_confusion: 'Students confuse longest simple path with shortest path: longest simple path lacks optimal substructure because visiting a vertex consumes it, preventing subproblem independence.',
        prerequisites: ['Mathematical induction', 'Proof by contradiction', 'Graph theory basics']
      },
      {
        id: 'concept-2',
        concept_name: 'Memoization Table Invariant',
        what_it_means: 'A hash table or array invariant where memo[subproblem] holds the exact cached solution once computed, or nil/sentinel if unvisited.',
        why_it_matters: 'Guarantees that each unique subproblem is computed at most once across the entire execution tree.',
        step_by_step: [
          'Check if subproblem key exists in memo.',
          'If found, immediately return memo[subproblem] in O(1).',
          'If not found, compute the recursive recurrence.',
          'Store result in memo[subproblem] before returning.'
        ],
        lecture_example: 'Python dictionary or fixed-size C array memo[n] used to store Fibonacci values.',
        common_confusion: 'Students often forget to store the value in the memo before returning from recursive branches, causing silent re-computation.'
      },
      {
        id: 'concept-3',
        concept_name: 'Subproblem Dependency Graph as a DAG',
        what_it_means: 'The visualization of subproblem calls where vertices represent subproblems and edges represent dependencies.',
        why_it_matters: 'Directly proves termination and allows converting any top-down recursion into a bottom-up nested loop.',
        step_by_step: [
          'Map each parameter tuple to a unique node.',
          'Draw directed edges from caller to required children.',
          'Verify that no cycle exists.',
          'Order loops by topological sort of this graph.'
        ],
        lecture_example: 'Prof. Demaine illustrates how Fibonacci vertices point downwards: n -> n-1, n -> n-2.',
        common_confusion: 'Trying to use dynamic programming when dependencies form a cycle with negative weights without relaxing edges.'
      }
    ],
    revision_sheet: {
      high_value_points: [
        'DP = Recursion + Memoization + Guessing.',
        'Runtime formula: Total Time = # Subproblems × (Time per subproblem excluding recursive calls).',
        'Top-down memoization computes only necessary states; bottom-up tabulation enables space optimization.',
        'Subproblem dependencies MUST form a Directed Acyclic Graph (DAG).',
        'For sequence/string problems, subproblems are usually Prefixes x[:i], Suffixes x[i:], or Substrings x[i:j].'
      ],
      formula_list: [
        {
          name: 'Total DP Complexity',
          formula: 'O(|S| · T_sub)',
          note: '|S| is total subproblems, T_sub is cost of choices excluding subproblem calls'
        },
        {
          name: 'Fibonacci Memoized Recurrence',
          formula: 'F(n) = F(n-1) + F(n-2) with F(0)=0, F(1)=1',
          note: 'O(n) time, O(1) space with rolling variables'
        },
        {
          name: 'Shortest Path DAG Recurrence',
          formula: 'dist(v) = min_{(u,v) ∈ E} [ dist(u) + w(u,v) ]',
          note: 'Topologically ordered relaxation'
        }
      ],
      critical_definitions: [
        {
          term: 'Overlapping Subproblems',
          definition: 'A space of subproblems where the same subproblems are called repeatedly rather than generating new subproblems at each step.'
        },
        {
          term: 'Optimal Substructure',
          definition: 'Property where an optimal solution to a problem contains optimal solutions to its subproblems.'
        },
        {
          term: 'Topological Sort',
          definition: 'Linear ordering of DAG vertices such that every directed edge uv has u coming before v.'
        }
      ],
      common_mistakes_to_avoid: [
        'Forgetting the base cases, which leads to infinite recursion or out-of-bounds array access.',
        'Creating subproblems with cycles (e.g. A depends on B, and B depends on A).',
        'Confusing number of subproblems with total recursive calls in naive code.',
        'Ignoring space complexity: forgetting that recursion stack uses O(depth) memory.'
      ],
      last_minute_checklist: [
        'Can you state the 5 steps of the MIT DP Recipe without looking?',
        'Do you know how to calculate |S| for prefix, suffix, and substring subproblems?',
        'Can you explain why Longest Simple Path does NOT have optimal substructure?',
        'Can you optimize bottom-up Fibonacci from O(n) space to O(1) space on a whiteboard?'
      ]
    },
    practice_questions: [
      {
        id: 'q-1',
        type: 'mcq',
        question: 'What is the exact time complexity of computing the n-th Fibonacci number using naive recursion without memoization?',
        options: [
          'O(n)',
          'O(n²)',
          'O(2^(n/2)) or Θ(φ^n) where φ is the golden ratio',
          'O(log n)'
        ],
        correct_answer: 'O(2^(n/2)) or Θ(φ^n) where φ is the golden ratio',
        explanation: 'Because every call to fib(k) triggers two recursive branches without reusing computed values, the recursion tree has roughly 2^(n/2) to φ^n leaves.',
        difficulty: 'Easy',
        timestamp_ref: '03:05'
      },
      {
        id: 'q-2',
        type: 'mcq',
        question: 'Which of the following subproblem formulations generates O(n²) subproblems for a string of length n?',
        options: [
          'All prefixes s[:i]',
          'All suffixes s[i:]',
          'All substrings s[i:j]',
          'All single character substitutions'
        ],
        correct_answer: 'All substrings s[i:j]',
        explanation: 'For a string of length n, there are n choices for the start index i and n choices for the end index j, yielding n(n+1)/2 = O(n²) distinct contiguous substrings.',
        difficulty: 'Medium',
        timestamp_ref: '27:01'
      },
      {
        id: 'q-3',
        type: 'conceptual',
        question: 'Explain why the Longest Path problem on a general graph with cycles does NOT satisfy optimal substructure, whereas Shortest Path does.',
        correct_answer: 'In the longest simple path problem, choosing a long sub-path between S and V consumes vertices. If the remaining path from V to T requires those same vertices, the sub-solutions cannot be independently stitched together. Shortest paths never repeat vertices if edge weights are non-negative, preserving subproblem independence.',
        explanation: 'Optimal substructure requires subproblem independence. In longest path, subproblems share state (the set of already visited vertices), breaking independence.',
        difficulty: 'Hard',
        timestamp_ref: '16:21'
      },
      {
        id: 'q-4',
        type: 'application',
        question: 'Given an array of coin denominations and a target amount T, formulate the DP recurrence relation for finding the minimum number of coins to make change.',
        correct_answer: 'Let DP[x] be the minimum coins to make amount x. Base case: DP[0] = 0. Recurrence: DP[x] = 1 + min_{c ∈ coins, c ≤ x} DP[x - c]. If no combination is possible, DP[x] = ∞.',
        explanation: 'At each step, we guess which coin c was the last coin chosen from the denomination set, and take the minimum across all valid coin guesses.',
        difficulty: 'Medium',
        timestamp_ref: '08:11'
      }
    ],
    flashcards: [
      {
        id: 'fc-1',
        topic: 'DP Fundamentals',
        difficulty: 'Easy',
        front: 'What are the two core prerequisites for a problem to be solvable via Dynamic Programming?',
        back: '1. Optimal Substructure (optimal solution contains optimal sub-solutions).\n2. Overlapping Subproblems (subproblems are repeated rather than always distinct).',
        hint: 'Think about subproblem structure and reusability'
      },
      {
        id: 'fc-2',
        topic: 'Complexity Analysis',
        difficulty: 'Medium',
        front: 'What is the Master Formula for calculating the running time of any Dynamic Programming algorithm?',
        back: 'Total Time = (Number of Subproblems |S|) × (Time spent per subproblem, excluding the recursive calls).',
        hint: 'Count states and transition work'
      },
      {
        id: 'fc-3',
        topic: 'Graph Equivalence',
        difficulty: 'Medium',
        front: 'Why must the subproblem dependency graph of any valid DP algorithm be a Directed Acyclic Graph (DAG)?',
        back: 'Because if a cycle existed, solving a subproblem would require its own solution, creating an infinite circular dependency loop. A DAG guarantees a topological ordering exists.',
        hint: 'Consider what would happen if a node depended on itself'
      },
      {
        id: 'fc-4',
        topic: 'Implementation Patterns',
        difficulty: 'Easy',
        front: 'What is the primary advantage of Bottom-Up Tabulation over Top-Down Memoization?',
        back: '1. Eliminates recursion call stack overhead (no stack overflow).\n2. Improves CPU cache locality.\n3. Enables space optimization by discarding unneeded earlier table rows.',
        hint: 'Think about memory and loops'
      },
      {
        id: 'fc-5',
        topic: 'String Subproblems',
        difficulty: 'Hard',
        front: 'For two strings of length m and n (e.g. Edit Distance / LCS), what is the subproblem state space and size?',
        back: 'Subproblems: prefixes x[:i] and y[:j].\nState size: |S| = (m + 1) × (n + 1) = O(m · n) subproblems.',
        hint: '2D grid of prefixes'
      }
    ],
    mind_map: {
      id: 'mm-root',
      label: 'Dynamic Programming (DP)',
      description: 'Systematic algorithmic paradigm: Recursion + Memoization + Guessing',
      children: [
        {
          id: 'mm-principles',
          label: 'Core Principles',
          description: 'Prerequisites for applicability',
          children: [
            { id: 'mm-opt-sub', label: 'Optimal Substructure', description: 'Global optimum contains subproblem optimums' },
            { id: 'mm-over-sub', label: 'Overlapping Subproblems', description: 'Same states queried multiple times' }
          ]
        },
        {
          id: 'mm-recipe',
          label: 'MIT 5-Step Recipe',
          description: 'Systematic workflow to solve any DP',
          children: [
            { id: 'mm-s1', label: '1. Define Subproblems', description: 'State space parameters: prefixes, suffixes, substrings' },
            { id: 'mm-s2', label: '2. Guess Choice', description: 'Identify transition choice (e.g., cut position, edge)' },
            { id: 'mm-s3', label: '3. Relate Subproblems', description: 'Formulate recurrence relation' },
            { id: 'mm-s4', label: '4. Recurse & Memoize', description: 'Top-down with cache OR bottom-up table' },
            { id: 'mm-s5', label: '5. Solve Original', description: 'Extract target result from memo/table' }
          ]
        },
        {
          id: 'mm-graph',
          label: 'DAG & Topological Order',
          description: 'Subproblem dependency guarantees',
          children: [
            { id: 'mm-g-nodes', label: 'Vertices = Subproblems', description: 'Each state is a node' },
            { id: 'mm-g-edges', label: 'Edges = Dependencies', description: 'Dependency u -> v' },
            { id: 'mm-g-order', label: 'Acyclicity Check', description: 'Ensures no infinite loops exist' }
          ]
        },
        {
          id: 'mm-patterns',
          label: 'Common State Patterns',
          description: 'Standard problem templates',
          children: [
            { id: 'mm-p-1d', label: '1D Prefixes / Suffixes', description: 'O(n) subproblems (Fibonacci, Rod Cutting)' },
            { id: 'mm-p-2d', label: '2D Grid / Substrings', description: 'O(n²) subproblems (LCS, Edit Distance)' },
            { id: 'mm-p-space', label: 'Rolling Space Optimization', description: 'Drop table memory from O(n) to O(1)' }
          ]
        }
      ]
    }
  }
};
