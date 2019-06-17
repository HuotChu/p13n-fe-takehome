
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
    const label = 'Column with id:';
    let msg = '';
    switch ( eventName ) {
      case 'scrollStart':
        msg = `${label} ${id} started to become visible on the page.`;
        break;
      case 'scrollHalf':
        msg = `${label} ${id} is now more than 50% visible on the page.`;
        break;
      case 'scrollComplete':
        msg = `${label} ${id} is now fully visible on the page.`;
    };
    let event = new CustomEvent( `${id}_${eventName}`, { detail: msg } );
    target.dispatchEvent( event );
  };

  const scanFoldForColumns = () => {
    const fold = Math.ceil( pageYOffset + viewHeight );
    columns.filter( target => target.top <= fold )
          .forEach( target => {
            let eventName = fold >= target.bottom ? 'scrollComplete' : ( fold > target.middle ) ? 'scrollHalf' : 'scrollStart';
            dispatch( eventName, target.column );
            } );
            if ( fold === pageHeight ) {
              window.removeEventListener( 'scroll', scanFoldForColumns );
            }
  };

  window.addEventListener( 'scroll', scanFoldForColumns );
};

document.addEventListener( 'DOMContentLoaded', initColumnEvents );
