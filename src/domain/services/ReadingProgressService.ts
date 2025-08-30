import { Verse } from '../entities/Verse';
import { Surah } from '../entities/Surah';
import { BookmarkPosition } from '../value-objects/BookmarkPosition';
import { IVerseRepository } from '../repositories/IVerseRepository';
import { ISurahRepository } from '../repositories/ISurahRepository';

/**
 * Reading session data
 */
export interface ReadingSession {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  currentPosition: BookmarkPosition;
  versesRead: number;
  totalTime: number; // in seconds
  completed: boolean;
}

/**
 * Reading progress data
 */
export interface ReadingProgress {
  userId: string;
  totalVersesRead: number;
  totalSurahsCompleted: number;
  totalReadingTime: number; // in seconds
  currentStreak: number;
  longestStreak: number;
  averageVersesPerSession: number;
  lastReadingDate: Date;
  completedSurahs: number[];
  currentlyReading: {
    surahId: number;
    progress: number; // percentage
    lastPosition: BookmarkPosition;
  }[];
}

/**
 * Reading statistics
 */
export interface ReadingStatistics {
  dailyAverage: number;
  weeklyAverage: number;
  monthlyAverage: number;
  favoriteReadingTime: string; // e.g., "morning", "evening"
  mostReadSurah: number;
  readingVelocity: number; // verses per minute
  consistencyScore: number; // 0-100
}

/**
 * Domain service for reading progress and session management.
 * Tracks user reading habits, progress, and provides insights.
 */
export class ReadingProgressService {
  constructor(
    private readonly verseRepository: IVerseRepository,
    private readonly surahRepository: ISurahRepository
  ) {}

  /**
   * Starts a new reading session
   */
  async startReadingSession(
    userId: string,
    surahId: number,
    ayahNumber: number = 1
  ): Promise<ReadingSession> {
    const startPosition = new BookmarkPosition(surahId, ayahNumber, new Date());

    const session: ReadingSession = {
      id: this.generateSessionId(),
      userId,
      startedAt: new Date(),
      currentPosition: startPosition,
      versesRead: 0,
      totalTime: 0,
      completed: false,
    };

    return session;
  }

  /**
   * Updates reading progress during a session
   */
  async updateReadingProgress(
    session: ReadingSession,
    newPosition: BookmarkPosition,
    timeSpent: number
  ): Promise<ReadingSession> {
    const versesRead = await this.calculateVersesRead(session.currentPosition, newPosition);

    return {
      ...session,
      currentPosition: newPosition,
      versesRead: session.versesRead + versesRead,
      totalTime: session.totalTime + timeSpent,
    };
  }

  /**
   * Completes a reading session
   */
  async completeReadingSession(session: ReadingSession): Promise<ReadingSession> {
    return {
      ...session,
      endedAt: new Date(),
      completed: true,
    };
  }

  /**
   * Calculates overall reading progress for a user
   */
  async calculateReadingProgress(
    userId: string,
    sessions: ReadingSession[]
  ): Promise<ReadingProgress> {
    const completedSessions = sessions.filter((s) => s.completed);

    const totalVersesRead = completedSessions.reduce((sum, s) => sum + s.versesRead, 0);
    const totalReadingTime = completedSessions.reduce((sum, s) => sum + s.totalTime, 0);
    const averageVersesPerSession =
      completedSessions.length > 0 ? totalVersesRead / completedSessions.length : 0;

    // Calculate completed Surahs
    const completedSurahs = await this.getCompletedSurahs(userId, sessions);

    // Calculate reading streak
    const currentStreak = this.calculateCurrentStreak(completedSessions);
    const longestStreak = this.calculateLongestStreak(completedSessions);

    // Calculate currently reading Surahs
    const currentlyReading = await this.getCurrentlyReadingSurahs(userId, sessions);

    const lastSession = completedSessions.sort(
      (a, b) => b.startedAt.getTime() - a.startedAt.getTime()
    )[0];

    return {
      userId,
      totalVersesRead,
      totalSurahsCompleted: completedSurahs.length,
      totalReadingTime,
      currentStreak,
      longestStreak,
      averageVersesPerSession,
      lastReadingDate: lastSession?.startedAt || new Date(0),
      completedSurahs,
      currentlyReading,
    };
  }

  /**
   * Generates reading statistics and insights
   */
  async generateReadingStatistics(
    userId: string,
    sessions: ReadingSession[],
    days: number = 30
  ): Promise<ReadingStatistics> {
    const recentSessions = sessions.filter(
      (s) => s.completed && s.startedAt >= new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    );

    const dailyAverage = recentSessions.length / days;
    const weeklyAverage = dailyAverage * 7;
    const monthlyAverage = dailyAverage * 30;

    // Calculate favorite reading time
    const favoriteReadingTime = this.getFavoriteReadingTime(recentSessions);

    // Calculate most read Surah
    const mostReadSurah = this.getMostReadSurah(recentSessions);

    // Calculate reading velocity (verses per minute)
    const totalVerses = recentSessions.reduce((sum, s) => sum + s.versesRead, 0);
    const totalMinutes = recentSessions.reduce((sum, s) => sum + s.totalTime / 60, 0);
    const readingVelocity = totalMinutes > 0 ? totalVerses / totalMinutes : 0;

    // Calculate consistency score
    const consistencyScore = this.calculateConsistencyScore(recentSessions, days);

    return {
      dailyAverage,
      weeklyAverage,
      monthlyAverage,
      favoriteReadingTime,
      mostReadSurah,
      readingVelocity,
      consistencyScore,
    };
  }

  /**
   * Provides reading recommendations based on progress
   */
  async getReadingRecommendations(
    progress: ReadingProgress,
    statistics: ReadingStatistics
  ): Promise<{
    nextSurah?: Surah;
    dailyGoal?: number;
    focusArea?: string;
    motivationalMessage?: string;
  }> {
    const recommendations: any = {};

    // Recommend next Surah
    if (progress.currentlyReading.length === 0) {
      // Recommend a new Surah based on difficulty and progress
      const nextSurah = await this.recommendNextSurah(progress);
      recommendations.nextSurah = nextSurah;
    }

    // Recommend daily goal
    const currentDaily = statistics.dailyAverage;
    if (currentDaily < 1) {
      recommendations.dailyGoal = Math.max(1, Math.ceil(currentDaily * 1.5));
    } else if (statistics.consistencyScore > 80) {
      recommendations.dailyGoal = Math.ceil(currentDaily * 1.2);
    }

    // Focus area recommendations
    if (statistics.consistencyScore < 50) {
      recommendations.focusArea = 'consistency';
    } else if (statistics.readingVelocity < 0.5) {
      recommendations.focusArea = 'pace';
    } else if (progress.totalSurahsCompleted < 10) {
      recommendations.focusArea = 'completion';
    }

    // Motivational message
    recommendations.motivationalMessage = this.generateMotivationalMessage(progress, statistics);

    return recommendations;
  }

  /**
   * Calculates verses read between two positions
   */
  private async calculateVersesRead(
    fromPosition: BookmarkPosition,
    toPosition: BookmarkPosition
  ): Promise<number> {
    if (fromPosition.equals(toPosition)) return 0;
    if (fromPosition.isAfter(toPosition)) return 0;

    if (fromPosition.surahId === toPosition.surahId) {
      return toPosition.ayahNumber - fromPosition.ayahNumber;
    } else {
      // Reading across Surahs - more complex calculation
      let totalVerses = 0;

      // Verses remaining in starting Surah
      const startSurah = await this.surahRepository.findById(fromPosition.surahId);
      if (startSurah) {
        totalVerses += startSurah.numberOfAyahs - fromPosition.ayahNumber + 1;
      }

      // Complete Surahs in between
      for (let surahId = fromPosition.surahId + 1; surahId < toPosition.surahId; surahId++) {
        const surah = await this.surahRepository.findById(surahId);
        if (surah) {
          totalVerses += surah.numberOfAyahs;
        }
      }

      // Verses read in ending Surah
      totalVerses += toPosition.ayahNumber - 1;

      return totalVerses;
    }
  }

  /**
   * Gets completed Surahs for a user
   */
  private async getCompletedSurahs(userId: string, sessions: ReadingSession[]): Promise<number[]> {
    // This would require more sophisticated tracking
    // For now, return empty array - would need to track completion per Surah
    return [];
  }

  /**
   * Gets currently reading Surahs with progress
   */
  private async getCurrentlyReadingSurahs(
    userId: string,
    sessions: ReadingSession[]
  ): Promise<
    Array<{
      surahId: number;
      progress: number;
      lastPosition: BookmarkPosition;
    }>
  > {
    // This would require more sophisticated tracking
    // For now, return empty array - would need to track progress per Surah
    return [];
  }

  /**
   * Calculates current reading streak
   */
  private calculateCurrentStreak(sessions: ReadingSession[]): number {
    if (sessions.length === 0) return 0;

    const sortedSessions = sessions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(23, 59, 59, 999); // End of today

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.startedAt);
      sessionDate.setHours(23, 59, 59, 999); // End of session day

      const daysDiff = Math.floor(
        (currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff <= 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Calculates longest reading streak
   */
  private calculateLongestStreak(sessions: ReadingSession[]): number {
    if (sessions.length === 0) return 0;

    const dailySessions = new Map<string, boolean>();

    sessions.forEach((session) => {
      const dateKey = session.startedAt.toISOString().split('T')[0];
      dailySessions.set(dateKey, true);
    });

    const sortedDates = Array.from(dailySessions.keys()).sort();
    let longestStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const daysDiff = Math.floor(
          (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 1) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      }
    }

    return Math.max(longestStreak, currentStreak);
  }

  /**
   * Gets favorite reading time of day
   */
  private getFavoriteReadingTime(sessions: ReadingSession[]): string {
    const timeCounts = { morning: 0, afternoon: 0, evening: 0, night: 0 };

    sessions.forEach((session) => {
      const hour = session.startedAt.getHours();
      if (hour >= 5 && hour < 12) timeCounts.morning++;
      else if (hour >= 12 && hour < 17) timeCounts.afternoon++;
      else if (hour >= 17 && hour < 21) timeCounts.evening++;
      else timeCounts.night++;
    });

    return Object.entries(timeCounts).sort(([, a], [, b]) => b - a)[0][0];
  }

  /**
   * Gets most read Surah
   */
  private getMostReadSurah(sessions: ReadingSession[]): number {
    const surahCounts = new Map<number, number>();

    sessions.forEach((session) => {
      const surahId = session.currentPosition.surahId;
      surahCounts.set(surahId, (surahCounts.get(surahId) || 0) + 1);
    });

    return Array.from(surahCounts.entries()).sort(([, a], [, b]) => b - a)[0]?.[0] || 1;
  }

  /**
   * Calculates consistency score (0-100)
   */
  private calculateConsistencyScore(sessions: ReadingSession[], days: number): number {
    const dailySessions = new Map<string, number>();

    sessions.forEach((session) => {
      const dateKey = session.startedAt.toISOString().split('T')[0];
      dailySessions.set(dateKey, (dailySessions.get(dateKey) || 0) + 1);
    });

    const daysWithReading = dailySessions.size;
    const consistency = (daysWithReading / days) * 100;

    return Math.min(100, Math.max(0, consistency));
  }

  /**
   * Recommends next Surah based on progress
   */
  private async recommendNextSurah(progress: ReadingProgress): Promise<Surah | null> {
    const completedSet = new Set(progress.completedSurahs);

    // Find first incomplete Surah
    for (let i = 1; i <= 114; i++) {
      if (!completedSet.has(i)) {
        return await this.surahRepository.findById(i);
      }
    }

    return null;
  }

  /**
   * Generates motivational message
   */
  private generateMotivationalMessage(
    progress: ReadingProgress,
    statistics: ReadingStatistics
  ): string {
    if (progress.currentStreak === 0) {
      return 'Start your reading journey today! Even one verse makes a difference.';
    } else if (progress.currentStreak < 7) {
      return `Great start! You're on a ${progress.currentStreak}-day streak. Keep it up!`;
    } else if (progress.currentStreak < 30) {
      return `Amazing dedication! ${progress.currentStreak} days of consistent reading.`;
    } else {
      return `Outstanding commitment! ${progress.currentStreak} days streak is truly inspiring.`;
    }
  }

  /**
   * Generates unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
