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
import { sortPlaysByRecency } from '@/app/utils/sortPlays';

type PlayRow = React.ComponentProps<typeof PlayTable>['plays'][number];
type RosterSpots = React.ComponentProps<typeof PlayEventDetails>['rosterSpots'];
type IceRinkGameProp = React.ComponentProps<typeof IceRink>['game'];
type IceRinkPlayProp = React.ComponentProps<typeof IceRink>['plays'];
type IceRinkRenderPlayProp = React.ComponentProps<typeof IceRink>['renderPlayByPlayEvent'];

interface PlayByPlayResponse {
  gameState?: string;
  periodDescriptor?: { number?: number };
  plays?: PlayRow[];
  rosterSpots?: RosterSpots;
}

interface PlayByPlayTeam {
  id?: number | string;
  abbrev: string;
  data?: Record<string, unknown>;
}

interface PlayByPlayGame {
  homeTeam: { abbrev: string };
  awayTeam: { abbrev: string };
  periodDescriptor?: { number?: number; periodType?: string; maxRegulationPeriods?: number };
}

interface GameDataForPlayByPlay {
  homeTeam: PlayByPlayTeam;
  awayTeam: PlayByPlayTeam;
  game: PlayByPlayGame;
}

const PlayByPlay: React.FC = () => {
  const { gameData } = useGameContext();
  const { id } = useParams() as { id: string };
  const [playByPlay, setPlayByPlay] = useState<PlayByPlayResponse | null>(null);
  const [gameState, setGameState] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<number | null>(null);
  const [eventFilter, setEventFilter] = useState<string | null>(null);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [videoPlayerLabel, setVideoPlayerLabel] = useState<string | null>(null);
  const [videoPlayerUrl, setVideoPlayerUrl] = useState<string | null>(null);
  const [isVideoPlayerVisible, setVideoPlayerVisible] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const playByPlayResponse = await fetch(`/api/nhl/gamecenter/${id}/play-by-play`, {
          cache: 'no-store',
        });
        const playByPlayData: PlayByPlayResponse = await playByPlayResponse.json();
        setPlayByPlay(playByPlayData);
        setGameState(playByPlayData.gameState || null);
        if (activePeriod === null) {
          setActivePeriod(playByPlayData.periodDescriptor?.number ?? null);
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
        setErrorState(error instanceof Error ? error : new Error('Unable to load play-by-play.'));
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

  if (errorState) {
    throw errorState;
  }

  if (!gameData || !playByPlay) {
    return <GameBodySkeleton />;
  }
  if (['PRE', 'FUT'].includes(gameState || '')) {
    return notFound();
  }

  const { homeTeam, awayTeam, game } = gameData as GameDataForPlayByPlay;
  homeTeam.data = getTeamDataByAbbreviation(game.homeTeam.abbrev, true) || {};
  awayTeam.data = getTeamDataByAbbreviation(game.awayTeam.abbrev, false) || {};

  const filteredPlays = (playByPlay.plays || []).filter((p: PlayRow) => {
    let includePlay = true;
    if (activePeriod) {
      includePlay = includePlay && p.periodDescriptor?.number === activePeriod;
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
    sortedPlays = sortPlaysByRecency(filteredPlays);
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
      theme={theme as React.ComponentProps<typeof TeamLogoByTeamId>['theme']}
    />
  );
  const renderPlayByPlayEvent = (play: PlayRow) => (
    <PlayEventDetails
      play={play as React.ComponentProps<typeof PlayEventDetails>['play']}
      game={game}
      rosterSpots={playByPlay.rosterSpots || []}
      lookupTeamDataByTeamId={lookupTeamDataByTeamId}
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
        periodData={game.periodDescriptor || {}}
        activePeriod={activePeriod || 0}
        onPeriodChange={setActivePeriod}
        includeAll={true}
        eventFilter={eventFilter}
        onEventFilterChange={setEventFilter}
        teamFilter={teamFilter}
        onTeamFilterChange={setTeamFilter}
        awayTeam={awayTeam as unknown as React.ComponentProps<typeof PlayFilters>['awayTeam']}
        homeTeam={homeTeam as unknown as React.ComponentProps<typeof PlayFilters>['homeTeam']}
      />
      <IceRink
        game={game as unknown as IceRinkGameProp}
        plays={filteredPlays as unknown as IceRinkPlayProp}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        renderPlayByPlayEvent={renderPlayByPlayEvent as unknown as IceRinkRenderPlayProp}
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
