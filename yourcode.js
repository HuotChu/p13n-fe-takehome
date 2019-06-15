
const initColumnEvents = () => {
  const pageHeight = document.documentElement.scrollHeight;
  const viewHeight = window.innerHeight;

  const columns = Array.from( document.querySelectorAll( '.column' ) )
                      .map( column => {
                        const { id } = column;
                        const { bottom, height, top } = column.getBoundingClientRect();

                        [ `${id}_scrollStart`, `${id}_scrollHalf`, `${id}_scrollComplete` ].forEach( eventName => {
                          column.addEventListener( eventName, e => console.log( e.detail ), { once: true }, false ); 
                        } );

                        return {
                          column,
                          top,
                          bottom: bottom - 10,
                          middle: top + height * .5
                        };
                      } )
                      .filter( column => column.top > pageYOffset + viewHeight )
                      .sort( ( a, b ) => a.top - b.top );
  
  const dispatch = ( eventName, target ) => {
    const { id } = target;
    let msg = '';
    switch ( eventName ) {
      case 'scrollStart':
        msg = `Column with id: ${id} started to become visible on the page.`;
        break;
      case 'scrollHalf':
        msg = `Column with id: ${id} is now more than 50% visible on the page.`;
        break;
      case 'scrollComplete':
        msg = `Column with id: ${id} is now fully visible on the page.`;
    };
    let event = new CustomEvent( `${id}_${eventName}`, { detail: msg } );
    target.dispatchEvent( event );
  };

  const scanFoldForColumns = () => {
    const fold = Math.ceil( pageYOffset + viewHeight );
    columns.filter( target => target.top <= fold )
          .forEach( target => {
              if ( fold >= target.bottom ) {
                dispatch( 'scrollComplete', target.column );
              } else if ( fold > target.middle ) {
                dispatch( 'scrollHalf', target.column );
              } else {
                dispatch( 'scrollStart', target.column );
              }
            } );
            if ( fold === pageHeight ) {
              window.removeEventListener( 'scroll', scanFoldForColumns );
            }
  };

  window.addEventListener( 'scroll', scanFoldForColumns );
};

document.addEventListener( 'DOMContentLoaded', initColumnEvents );
