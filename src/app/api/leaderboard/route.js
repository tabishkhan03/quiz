import dbConnect from '@/lib/mongodb';
import { verifyAuth } from '@/lib/auth';
import Attempt from '@/models/Attempt';
import User from '@/models/User';

export async function GET(req) {
  await dbConnect();
  const user = verifyAuth(req);
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const attempts = await Attempt.find().populate('userId', 'name email');

    const userScores = {};
    for (const attempt of attempts) {
      const id = attempt.userId._id.toString();
      if (!userScores[id]) {
        userScores[id] = {
          name: attempt.userId.name,
          email: attempt.userId.email,
          totalScore: 0,
        };
      }
      userScores[id].totalScore += attempt.score;
    }

    // Step 2: Sort all users by score
    const leaderboard = Object.values(userScores)
      .sort((a, b) => b.totalScore - a.totalScore);

    // Step 3: Find current user's rank
    const currentUserIndex = leaderboard.findIndex(entry => entry.email === user.email);
    const currentUserRank = currentUserIndex + 1;
    const currentUserData = leaderboard[currentUserIndex];

    // Step 4: Get top 10 users
    const top10 = leaderboard.slice(0, 10);

    // Step 5: Add current user as 11th row if not already in top 10
    const inTop10 = top10.some(entry => entry.email === user.email);
    if (!inTop10 && currentUserData) {
      top10.push({
        ...currentUserData,
        rank: currentUserRank,
      });
    }

    // Step 6: Add rank to top 10 rows
    const result = top10.map((entry, index) => ({
      rank: entry.rank || index + 1,
      name: entry.name,
      email: entry.email,
      totalScore: entry.totalScore,
    }));

    return Response.json({ data: result });

  } catch (err) {
    console.error("Leaderboard error:", err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
