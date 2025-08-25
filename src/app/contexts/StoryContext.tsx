import React, { createContext, useState, useEffect, useContext } from 'react';
import { formatHeadTitle, formatLocalizedDate } from '@/app/utils/formatters';

// --- Domain (partial) ---
interface Tag { externalSourceName?: string; extraData?: { gameId?: string }; [k: string]: any }
interface StoryEntity { slug?: string; tags?: Tag[]; contentDate?: string; headline?: string; title?: string; [k: string]: any }
interface GameLanding { [k: string]: any }
interface PageError { message: string; error: any }

interface StoryContextValue {
  story: StoryEntity;
  game: GameLanding | null;
  players: Tag[];
  sidebarStories: any; // keep loose; components treat as unknown list
  pageError: PageError | null;
}

const StoryContext = createContext<StoryContextValue | undefined>(undefined);
export const useStoryContext = (): StoryContextValue => {
  const ctx = useContext(StoryContext);
  if (!ctx) {
    throw new Error('useStoryContext must be used within a StoryProvider');
  }

  return ctx;
};

// Generic fetch wrapper
const fetchJsonData = async <T=any>(url: string): Promise<T> => {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  return response.json();
};

const fetchStory = async (storyId: string): Promise<string | StoryEntity> => {
  const isLegacyStory = /^c-\d+$/.test(storyId);
  if (isLegacyStory) {
    const homebaseContent: any = await fetchJsonData(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories/?fields.homebaseId=${storyId.replace('c-', '')}`);
    
    return homebaseContent.items[0].slug;
  }

  return fetchJsonData<StoryEntity>(`https://forge-dapi.d3.nhle.com/v2/content/en-us/stories/${storyId}`);
};

const fetchSidebarStories = () => fetchJsonData('https://forge-dapi.d3.nhle.com/v2/content/en-us/stories?tags.slug=news&context.slug=nhl&$limit=5');
const fetchGameData = (gameId: string) => fetchJsonData(`/api/nhl/gamecenter/${gameId}/landing`);

interface StoryProviderProps { storyId: string; children: React.ReactNode }

export const StoryProvider: React.FC<StoryProviderProps> = ({ storyId, children }) => {
  const [story, setStory] = useState<StoryEntity>({});
  const [game, setGame] = useState<GameLanding | null>(null);
  const [players, setPlayers] = useState<Tag[]>([]);
  const [sidebarStories, setSidebarStories] = useState<any>([]);
  const [pageError, setPageError] = useState<PageError | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storyResponse = await fetchStory(storyId);
        if (typeof storyResponse === 'string') {
          window.location.replace(`/news/${storyResponse}`);
          
          return;
        }

        const topStories = await fetchSidebarStories();

        const gameTag = storyResponse.tags?.find((t) => t.externalSourceName === 'game');
        if (gameTag?.extraData?.gameId) {
          const gameResponse = await fetchGameData(gameTag.extraData.gameId);
          setGame(gameResponse);
        }

        const playerTags = storyResponse.tags?.filter((t) => t.externalSourceName === 'player') || [];
        if (playerTags.length) {
          setPlayers(playerTags);
        }

        setSidebarStories(topStories);
        setStory(storyResponse);
        formatHeadTitle(`${formatLocalizedDate(storyResponse.contentDate)}: ${storyResponse.headline || storyResponse.title}`);
      } catch (error) {
        setPageError({ message: 'Failed to load story. Please try again later.', error });
        // eslint-disable-next-line no-console
        console.error('Error fetching story data:', error);
      }
    };

    loadData();
  }, [storyId]);

  const value: StoryContextValue = { story, game, players, sidebarStories, pageError };

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  );
};

export default StoryProvider;
