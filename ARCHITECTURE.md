# System Architecture — MCQ Prep Portal

This document details the question bank data model, Zustand store state machine, and exam scoring pipeline.

## Architecture Overview

```text
[ Quiz Portal (React 19 + TypeScript) ]
         |
         +---> [ Zustand Central State Store (store/useQuizStore.ts) ]
         |            |
         |            +--- Exam Timer Subsystem (Tick Interceptor)
         |            +--- Session Question Array (Deterministic Shuffle)
         |            +--- Answer Bitmasks & Scores
         |
         +---> [ Question Bank Modules (data/questions.ts) ]
         |            |
         |            +--- Emerging Trends in CE & IT (Units 1-6)
         |            +--- Industrial Management (Units 1-6)
         |
         +---> [ Post-Exam Analytics & Weakness Breakdown Engine ]
```

### Store Guarantees
1. **Immutable Session Recovery:** Zustand store snapshots answers per question ID to prevent data loss on unintended refresh.
2. **Deterministic Shuffling:** Fisher-Yates randomization algorithm ensures uniform option dispersion without answer bias.
