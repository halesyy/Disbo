# Disbo
Habbo -> Discord Implementation

Oliy and Jek at it again, maybe this tag-team time they'll make something long-lasting? Lmao

*I wouldn't count on it - oliy*


## Some notes, since the original developer is amazing but stupid

### How rooms are stored: as matrix's

Check out `/server/h5/game/user/room.js` to get a glimpse into this lovely fest.

### How the A* sorting algorithm was implemented

At `/server/h5/game/rooms/move.js`, the algorithm is implemented with the optional argument **allowDiagonal**, which in the future may be a room-specific variable changed by the want to stop skipping.
