/**
 * Domain Entity: MemorizationPlan
 *
 * Represents a structured plan for memorizing Quranic verses with progress tracking.
 * Encapsulates memorization business logic and progress management.
 */

export type MemorizationStatus =
  | 'not_started'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'mastered';
export type MemorizationDifficulty = 'easy' | 'medium' | 'hard';

export interface VerseProgress {
  verseKey: string;
  status: MemorizationStatus;
  attempts: number;
  firstMemorized?: number; // timestamp
  lastReviewed?: number; // timestamp
  confidenceLevel: number; // 0-100
  notes?: string;
  difficulty?: MemorizationDifficulty;
}

export interface ReviewSession {
  id: string;
  timestamp: number;
  versesReviewed: string[];
  correctCount: number;
  incorrectCount: number;
  duration: number; // minutes
  notes?: string;
}

export interface MemorizationGoal {
  id: string;
  name: string;
  targetDate?: number; // timestamp
  dailyTarget?: number; // verses per day
  description?: string;
}

export class MemorizationPlan {
  private constructor(
    public readonly id: string,
    public readonly surahId: number,
    public readonly planName: string,
    public readonly targetVerses: number,
    public readonly verseProgress: Map<string, VerseProgress>,
    public readonly createdAt: number,
    public readonly lastUpdated: number,
    public readonly goals: MemorizationGoal[],
    public readonly reviewSessions: ReviewSession[],
    public readonly notes?: string,
    public readonly isActive: boolean = true
  ) {}

  /**
   * Factory method to create a new memorization plan
   */
  static create(surahId: number, targetVerses: number, planName?: string): MemorizationPlan {
    const id = `memo_plan_${surahId}_${Date.now()}`;
    const name = planName || `Surah ${surahId} Memorization`;
    const now = Date.now();

    return new MemorizationPlan(
      id,
      surahId,
      name,
      targetVerses,
      new Map(),
      now,
      now,
      [],
      [],
      undefined,
      true
    );
  }

  /**
   * Factory method to reconstruct from storage
   */
  static fromStorage(data: {
    id: string;
    surahId: number;
    planName: string;
    targetVerses: number;
    verseProgress: Array<[string, VerseProgress]>;
    createdAt: number;
    lastUpdated: number;
    goals: MemorizationGoal[];
    reviewSessions: ReviewSession[];
    notes?: string;
    isActive?: boolean;
  }): MemorizationPlan {
    const progressMap = new Map(data.verseProgress);

    return new MemorizationPlan(
      data.id,
      data.surahId,
      data.planName,
      data.targetVerses,
      progressMap,
      data.createdAt,
      data.lastUpdated,
      data.goals,
      data.reviewSessions,
      data.notes,
      data.isActive ?? true
    );
  }

  /**
   * Add verse to memorization plan (returns new instance - immutable)
   */
  addVerse(verseKey: string): MemorizationPlan {
    if (this.verseProgress.has(verseKey)) {
      return this; // Already exists
    }

    const newProgress = new Map(this.verseProgress);
    newProgress.set(verseKey, {
      verseKey,
      status: 'not_started',
      attempts: 0,
      confidenceLevel: 0,
    });

    return new MemorizationPlan(
      this.id,
      this.surahId,
      this.planName,
      this.targetVerses,
      newProgress,
      this.createdAt,
      Date.now(),
      this.goals,
      this.reviewSessions,
      this.notes,
      this.isActive
    );
  }

  /**
   * Update verse progress (returns new instance - immutable)
   */
  updateVerseProgress(verseKey: string, updates: Partial<VerseProgress>): MemorizationPlan {
    const currentProgress = this.verseProgress.get(verseKey);
    if (!currentProgress) {
      return this; // Verse not in plan
    }

    const newProgress = new Map(this.verseProgress);
    newProgress.set(verseKey, { ...currentProgress, ...updates });

    return new MemorizationPlan(
      this.id,
      this.surahId,
      this.planName,
      this.targetVerses,
      newProgress,
      this.createdAt,
      Date.now(),
      this.goals,
      this.reviewSessions,
      this.notes,
      this.isActive
    );
  }

  /**
   * Mark verse as memorized (returns new instance - immutable)
   */
  markVerseMemorized(verseKey: string, confidenceLevel: number = 80): MemorizationPlan {
    const currentProgress = this.verseProgress.get(verseKey);
    if (!currentProgress) {
      return this; // Verse not in plan
    }

    const now = Date.now();
    const updates: Partial<VerseProgress> = {
      status: confidenceLevel >= 90 ? 'mastered' : 'completed',
      confidenceLevel,
      attempts: currentProgress.attempts + 1,
      firstMemorized: currentProgress.firstMemorized || now,
      lastReviewed: now,
    };

    return this.updateVerseProgress(verseKey, updates);
  }

  /**
   * Add review session (returns new instance - immutable)
   */
  addReviewSession(session: Omit<ReviewSession, 'id'>): MemorizationPlan {
    const newSession: ReviewSession = {
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...session,
    };

    // Update last reviewed timestamps for reviewed verses
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let updatedPlan: MemorizationPlan = this;
    session.versesReviewed.forEach((verseKey) => {
      updatedPlan = updatedPlan.updateVerseProgress(verseKey, {
        lastReviewed: session.timestamp,
      });
    });

    return new MemorizationPlan(
      updatedPlan.id,
      updatedPlan.surahId,
      updatedPlan.planName,
      updatedPlan.targetVerses,
      updatedPlan.verseProgress,
      updatedPlan.createdAt,
      Date.now(),
      updatedPlan.goals,
      [...updatedPlan.reviewSessions, newSession],
      updatedPlan.notes,
      updatedPlan.isActive
    );
  }

  /**
   * Add goal to plan (returns new instance - immutable)
   */
  addGoal(goal: Omit<MemorizationGoal, 'id'>): MemorizationPlan {
    const newGoal: MemorizationGoal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...goal,
    };

    return new MemorizationPlan(
      this.id,
      this.surahId,
      this.planName,
      this.targetVerses,
      this.verseProgress,
      this.createdAt,
      Date.now(),
      [...this.goals, newGoal],
      this.reviewSessions,
      this.notes,
      this.isActive
    );
  }

  /**
   * Update plan name (returns new instance - immutable)
   */
  updateName(newName: string): MemorizationPlan {
    if (this.planName === newName) return this;

    return new MemorizationPlan(
      this.id,
      this.surahId,
      newName,
      this.targetVerses,
      this.verseProgress,
      this.createdAt,
      Date.now(),
      this.goals,
      this.reviewSessions,
      this.notes,
      this.isActive
    );
  }

  /**
   * Pause/resume plan (returns new instance - immutable)
   */
  setActive(isActive: boolean): MemorizationPlan {
    if (this.isActive === isActive) return this;

    return new MemorizationPlan(
      this.id,
      this.surahId,
      this.planName,
      this.targetVerses,
      this.verseProgress,
      this.createdAt,
      Date.now(),
      this.goals,
      this.reviewSessions,
      this.notes,
      isActive
    );
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(): number {
    if (this.verseProgress.size === 0) return 0;

    const completedVerses = Array.from(this.verseProgress.values()).filter(
      (p) => p.status === 'completed' || p.status === 'mastered'
    ).length;

    return Math.round((completedVerses / this.verseProgress.size) * 100);
  }

  /**
   * Get verses by status
   */
  getVersesByStatus(status: MemorizationStatus): VerseProgress[] {
    return Array.from(this.verseProgress.values()).filter((p) => p.status === status);
  }

  /**
   * Get verses needing review
   */
  getVersesNeedingReview(daysSinceReview: number = 7): VerseProgress[] {
    const cutoff = Date.now() - daysSinceReview * 24 * 60 * 60 * 1000;

    return Array.from(this.verseProgress.values()).filter((p) => {
      if (p.status === 'not_started') return false;
      return !p.lastReviewed || p.lastReviewed < cutoff;
    });
  }

  /**
   * Get average confidence level
   */
  getAverageConfidence(): number {
    const verses = Array.from(this.verseProgress.values());
    if (verses.length === 0) return 0;

    const total = verses.reduce((sum, p) => sum + p.confidenceLevel, 0);
    return Math.round(total / verses.length);
  }

  /**
   * Get statistics
   */
  getStatistics(): MemorizationStatistics {
    const verses = Array.from(this.verseProgress.values());
    const statusCounts = {
      not_started: 0,
      in_progress: 0,
      review: 0,
      completed: 0,
      mastered: 0,
    };

    verses.forEach((v) => {
      statusCounts[v.status]++;
    });

    const totalAttempts = verses.reduce((sum, v) => sum + v.attempts, 0);
    const averageAttempts = verses.length > 0 ? totalAttempts / verses.length : 0;

    return {
      totalVerses: verses.length,
      completionPercentage: this.getCompletionPercentage(),
      averageConfidence: this.getAverageConfidence(),
      statusDistribution: statusCounts,
      totalReviewSessions: this.reviewSessions.length,
      averageAttemptsPerVerse: Math.round(averageAttempts * 100) / 100,
      activeDays: this.getActiveDays(),
      currentStreak: this.getCurrentStreak(),
    };
  }

  /**
   * Get number of active days (days with progress)
   */
  getActiveDays(): number {
    const sessions = this.reviewSessions;
    const uniqueDays = new Set(sessions.map((s) => new Date(s.timestamp).toDateString()));
    return uniqueDays.size;
  }

  /**
   * Get current streak (consecutive days with activity)
   */
  getCurrentStreak(): number {
    const sessions = this.reviewSessions.sort((a, b) => b.timestamp - a.timestamp);

    if (sessions.length === 0) return 0;

    let streak = 1;
    let currentDate = new Date(sessions[0].timestamp);

    for (let i = 1; i < sessions.length; i++) {
      const sessionDate = new Date(sessions[i].timestamp);
      const daysDiff = Math.floor(
        (currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Get next verses to memorize (based on plan strategy)
   */
  getNextVersesToMemorize(count: number = 3): string[] {
    return Array.from(this.verseProgress.entries())
      .filter(([_, progress]) => progress.status === 'not_started')
      .slice(0, count)
      .map(([verseKey]) => verseKey);
  }

  /**
   * Check if plan is on track (meeting daily goals)
   */
  isOnTrack(): boolean {
    const activeGoals = this.goals.filter((g) => g.targetDate && g.targetDate > Date.now());
    if (activeGoals.length === 0) return true; // No active goals

    // Simple check: are we progressing at the required rate?
    const completion = this.getCompletionPercentage();
    return completion >= 50; // Simplified logic
  }

  /**
   * Convert to storage format
   */
  toStorage(): MemorizationPlanStorageData {
    return {
      id: this.id,
      surahId: this.surahId,
      planName: this.planName,
      targetVerses: this.targetVerses,
      verseProgress: Array.from(this.verseProgress.entries()),
      createdAt: this.createdAt,
      lastUpdated: this.lastUpdated,
      goals: this.goals,
      reviewSessions: this.reviewSessions,
      notes: this.notes,
      isActive: this.isActive,
    };
  }
}

export interface MemorizationStatistics {
  totalVerses: number;
  completionPercentage: number;
  averageConfidence: number;
  statusDistribution: Record<MemorizationStatus, number>;
  totalReviewSessions: number;
  averageAttemptsPerVerse: number;
  activeDays: number;
  currentStreak: number;
}

export interface MemorizationPlanStorageData {
  id: string;
  surahId: number;
  planName: string;
  targetVerses: number;
  verseProgress: Array<[string, VerseProgress]>;
  createdAt: number;
  lastUpdated: number;
  goals: MemorizationGoal[];
  reviewSessions: ReviewSession[];
  notes?: string;
  isActive: boolean;
}
