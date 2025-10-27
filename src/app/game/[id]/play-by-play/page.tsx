'use client';

import React, { useEffect, useState } from 'react';
import { getTeamDataByAbbreviation } from '@/app/utils/teamData';
import { useGameContext } from '@/app/contexts/GameContext';
import GameBodySkeleton from '@/app/components/GameBodySkeleton';
import { notFound, useParams } from 'next/navigation';
import IceRink from '@/app/components/IceRink';
import FloatingVideoPlayer from '@/app/components/FloatingVideoPlayer';
import PlayFilters from '@/app/components/PlayFilters';
import PlayTable from '@/app/components/PlayTable';
import PlayEventDetails from '@/app/components/PlayEventDetails';
import TeamLogoByTeamId from '@/app/components/TeamLogoByTeamId';

const PlayByPlay: React.FC = () => {
  const { gameData } = useGameContext();
  const { id } = useParams() as { id: string };
  const [playByPlay, setPlayByPlay] = useState<any>(null);
  const [gameState, setGameState] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<number | null>(null);
  const [eventFilter, setEventFilter] = useState<string | null>(null);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [videoPlayerLabel, setVideoPlayerLabel] = useState<string | null>(null);
  const [videoPlayerUrl, setVideoPlayerUrl] = useState<string | null>(null);
  const [isVideoPlayerVisible, setVideoPlayerVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const playByPlayResponse = await fetch(`/api/nhl/gamecenter/${id}/play-by-play`, {
          cache: 'no-store',
        });
        const playByPlayData = await playByPlayResponse.json();
        setPlayByPlay(playByPlayData);
        setGameState(playByPlayData.gameState);
        if (activePeriod === null) {
          setActivePeriod(playByPlayData.periodDescriptor?.number);
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };
    fetchGameData();
    if (['PRE', 'LIVE', 'CRIT'].includes(gameState || '')) {
      const intervalId = setInterval(fetchGameData, 20000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [id, gameState, activePeriod]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVideoPlayerVisible(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!gameData || !playByPlay) {
    return <GameBodySkeleton />;
  }
  if (['PRE', 'FUT'].includes(gameState || '')) {
    return notFound();
  }

  const { homeTeam, awayTeam, game } = gameData as any;
  homeTeam.data = getTeamDataByAbbreviation(game.homeTeam.abbrev, true) || {};
  awayTeam.data = getTeamDataByAbbreviation(game.awayTeam.abbrev, false) || {};

  const filteredPlays = (playByPlay.plays || []).filter((p: any) => {
    let includePlay = true;
    if (activePeriod) {
      includePlay = includePlay && p.periodDescriptor.number === activePeriod;
    }
    if (eventFilter && eventFilter !== 'all') {
      includePlay = includePlay && p.typeDescKey === eventFilter;
    }
    if (teamFilter && teamFilter !== 'all') {
      includePlay = includePlay && String(p.details?.eventOwnerTeamId) === teamFilter;
    }

    return includePlay;
  });
  let sortedPlays = filteredPlays;
  if (['LIVE', 'CRIT'].includes(playByPlay.gameState || '')) {
    sortedPlays = [...filteredPlays].sort((a, b) => b.sortOrder - a.sortOrder);
  }

  const lookupTeamDataByTeamId = (teamId: number) => {
    if (teamId === awayTeam.id) {
      return getTeamDataByAbbreviation(awayTeam.abbrev, false);
    }
    if (teamId === homeTeam.id) {
      return getTeamDataByAbbreviation(homeTeam.abbrev, true);
    }

    return {};
  };
  const renderTeamLogo = (teamId?: number | string, size?: number, theme?: string) => (
    <TeamLogoByTeamId
      teamId={teamId}
      homeTeam={homeTeam}
      awayTeam={awayTeam}
      size={size}
      theme={theme as any}
    />
  );
  const renderPlayByPlayEvent = (play: any) => (
    <PlayEventDetails
      play={play}
      game={game}
      rosterSpots={playByPlay.rosterSpots}
      lookupTeamDataByTeamId={lookupTeamDataByTeamId as any}
      onOpenHighlight={({ url, label }) => {
        setVideoPlayerUrl(url);
        setVideoPlayerLabel(label);
        setVideoPlayerVisible(true);
      }}
    />
  );

  const handleVideoPlayerClose = () => {
    setVideoPlayerVisible(false);
    setVideoPlayerLabel(null);
    setVideoPlayerUrl(null);
  };

  return (
    <div>
      <PlayFilters
        periodData={game.periodDescriptor}
        activePeriod={activePeriod || 0}
        onPeriodChange={setActivePeriod}
        includeAll={true}
        eventFilter={eventFilter}
        onEventFilterChange={setEventFilter}
        teamFilter={teamFilter}
        onTeamFilterChange={setTeamFilter}
        awayTeam={awayTeam}
        homeTeam={homeTeam}
      />
      <IceRink
        game={game}
        plays={filteredPlays}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        renderPlayByPlayEvent={renderPlayByPlayEvent}
        renderTeamLogo={renderTeamLogo}
      />
      <PlayTable
        plays={sortedPlays}
        activePeriod={activePeriod}
        renderPlayByPlayEvent={renderPlayByPlayEvent}
        renderTeamLogo={(teamId?: number | string) => renderTeamLogo(teamId)}
      />
      <FloatingVideoPlayer
        isVisible={isVideoPlayerVisible}
        url={videoPlayerUrl || ''}
        label={videoPlayerLabel || ''}
        onClose={handleVideoPlayerClose}
      />
    </div>
  );
};

export default PlayByPlay;
