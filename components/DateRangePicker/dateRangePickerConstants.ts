export const DESKTOP_VIEWPORT_WIDTH = 1024;

export const themeStyles = {
  wrapper: {
    background: '#ffffff',
    color: '#383838',
    border: '0',
    borderRadius: '0'
  },
  dayCellNotInMonth: {
    display: 'none'
  },
  verticalDivider: {borderLeft: 0, paddingLeft: '20px'},
  weekdays: {
    color: '#383838', // New color
    fontWeight: '600' // And bolder font weight
  },
  dayCell: {
    margin: '0 0 0 -1px',
    border: '1px solid #ededed'
  },
  dayContent({isHovered}: { [key: string]: boolean }) {
    return {
      width: '44px',
      height: '44px',
      backgroundColor: isHovered ? '#383838' : 'transparent',
      color: isHovered ? '#ffffff' : '#383838'
    };
  }
};

export const highlightAttribute = {
  highlight({onStart, onEnd, targetDate}: { onStart: boolean, onEnd: boolean, targetDate: {isRange: boolean} }) {
    const backgroundColor = targetDate.isRange && !onStart && !onEnd ? '#757575' : '#383838';
    return {backgroundColor};
  },
  contentStyle: {
    color: '#ffffff'
  }
};

export const disabledAttribute = {
  contentStyle: {
    color: '#EDEDED!important',
    cursor: 'default!important',
    backgroundColor: 'transparent!important'
  }
};
