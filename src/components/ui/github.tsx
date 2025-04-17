"use client";
import { useCallback, useEffect, useState } from "react";
import Calendar, { Activity, ActivityCalendar } from "react-activity-calendar";

type GithubGraphProps = {
  username: string;
  blockMargin?: number;
  colorPallete?: string[];
};

export const GithubGraph = ({
  username,
  blockMargin,
  colorPallete,
}: GithubGraphProps) => {
  const [contribution, setContribution] = useState<Activity[]>([]);
  const [loading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      const contributions = await fetchContributionData(username);
      setContribution(contributions);
    } catch (error) {
      console.error("Error fetching contribution data", error);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const label = {
    totalCount: `{{count}} contributions in the last year`,
  };

  return (
    <ActivityCalendar
      data={contribution}
      maxLevel={4}
      blockMargin={blockMargin ?? 2}
      loading={loading}
      labels={label}
      theme={{
        dark:
          colorPallete ?? ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
      }}
    />
  );
};

// ✅ New fetch function using a reliable API
async function fetchContributionData(username: string): Promise<Activity[]> {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch contribution data");
  }

  const data = await response.json();
  return data.contributions;
}
