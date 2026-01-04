import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getTeamDataByAbbreviation } from '../utils/teamData';

interface HeadshotProps {
  src?: string;
  alt: string;
  className?: string;
  size?: string | number; // rem units numeric or string
  playerId?: number | string;
  team?: string;
}

const Headshot: React.FC<HeadshotProps> = ({
  src,
  alt,
  className = '',
  size = '4',
  playerId = 0,
  team,
}) => {
  const sizeValue = typeof size === 'number' ? size : parseFloat(size) || 0;
  const style: React.CSSProperties = { maxHeight: `${sizeValue}rem`, maxWidth: `${sizeValue}rem` };
  if (team) {
    const { teamColor, secondaryTeamColor } = getTeamDataByAbbreviation(team, true) || ({} as any);
    if (teamColor) {
      (style as any).backgroundColor = teamColor;
      (style as any).backgroundImage = `linear-gradient(to bottom, ${teamColor}, #FFFFFF)`;
    }
    if (secondaryTeamColor) {
      (style as any).border = `2px solid ${secondaryTeamColor}`;
    }
  }

  const finalClassName = `${className} rounded-full bg-linear-to-tr from-gray-500 via-gray-300 to-gray-100 shadow-md`;

  if (!src) {
    return <div className={finalClassName} />;
  }

  const image = (
    <Image src={src} alt={alt} className={finalClassName} width={256} height={256} style={style} />
  );

  if (playerId && Number(playerId) > 0) {
    return (
      <div className="flex justify-center">
        <Link href={`/player/${playerId}`}>{image}</Link>
      </div>
    );
  }

  return image;
};

export default Headshot;
