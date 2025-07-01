import React from 'react';

const ChessSquare = ({
  square,
  piece,
  pieceImg,
  pieceName,
  squareColor,
  onClick,
  isSelected,
  isValidMove,
  disabled
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const getSquareClass = () => {
    let classes = ['chess-square', squareColor];
    
    if (isSelected) {
      classes.push('selected');
    }
    
    if (isValidMove) {
      classes.push('valid-move');
    }
    
    if (disabled) {
      classes.push('disabled');
    }
    
    return classes.join(' ');
  };

  return (
    <div
      className={getSquareClass()}
      onClick={handleClick}
      title={pieceName || square}
    >
      {pieceImg && (
        <img
          src={pieceImg}
          alt={pieceName || ''}
          className="chess-piece-img"
          draggable={false}
        />
      )}
      {isValidMove && !piece && (
        <div className="valid-move-indicator" />
      )}
      {isSelected && (
        <div className="selected-indicator" />
      )}
    </div>
  );
};

export default ChessSquare; 