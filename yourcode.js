
const dispatch = ( eventName, target ) => {
  const id = target.id;
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

const columns = document.querySelectorAll( '.column' );

columns.forEach( column => {
  let { id } = column;
  [ `${id}_scrollStart`, `${id}_scrollHalf`, `${id}_scrollComplete` ].forEach( eventName => {
    column.addEventListener( eventName, e => console.log( e.detail ), { once: true }, false );
  } );
} );

let targets = Array.from( columns )
                   .map( column => {
                     let { bottom, height, top } = column.getBoundingClientRect();
                     return {
                       column,
                       top,
                       bottom: bottom - 10,
                       middle: top + height * .5
                     }
                   } )
                   .filter( column => column.top > pageYOffset + window.innerHeight )
                   .sort( ( a, b ) => a.top - b.top );

window.addEventListener( 'scroll', () => {
  const fold = pageYOffset + window.innerHeight;
  Array.from( targets )
       .filter( target => target.top <= fold )
       .forEach( target => {
        if ( fold >= target.bottom ) {
          dispatch( 'scrollComplete', target.column );
        } else if ( fold > target.middle ) {
          dispatch( 'scrollHalf', target.column );
        } else {
          dispatch( 'scrollStart', target.column );
        }
       } );
} );
