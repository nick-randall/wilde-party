const buildAnimationFromUpdateData = (snapshot: GameSnapshot) => {
  // const { snapshotUpdateData } = snapshot;

  // const { type, playedCardIds, targetId, secondaryCardId } = snapshotUpdateData;
  // if (type === "addDragged") {
  //   const activeAnimation = createHandToTableAnimation({
  //     cardId: cardIds[0],
  //     handId: fromPlaceId,
  //     targetPlaceId,
  //     newSnapshot,
  //     placeRefMap,
  //     oldSnapshot: snapshot,
  //   });
  //   // animationTimeline.animationData.forEach(d => console.log(d.keyframesString));
  //   // End the animations just before they are to finish, which avoids an animation flash
  //   // in the place that has given up its card as it changes to new snapshot
  //   setTimeout(() => resolveNewSnapshot(), activeAnimation.totalDuration - 20);
  //   setActiveAnimation(activeAnimation);
  // }
  // if (type === "dealCards") {
  //   const activeAnimation = createDealCardsAnimation({
  //     cardIds,
  //     deckId: fromPlaceId,
  //     handId: targetPlaceId,
  //     newSnapshot,
  //     placeRefMap,
  //     oldSnapshot: snapshot,
  //   });
  //   // animations.forEach(d => console.log(d.keyframesString));
  //   setActiveAnimation(activeAnimation);
  //   setTimeout(() => resolveNewSnapshot(), activeAnimation.totalDuration - 20);
  // }

  // if (diff.type === "destroy") {
  //   const handCard = snapshot.hand.cards.find(c => cardIds.some(id => c.id === id));
  //   const activeAnimation = createDestroyAnimation({
  //     handCardId: handCard!.id,
  //     handId: fromPlaceId,
  //     discardPileId: targetPlaceId,
  //     GCZCardId: intermediateTargetCardId!,
  //     GCZId: intermediateTargetPlaceId!,
  //     newSnapshot,
  //     placeRefMap,
  //     oldSnapshot: snapshot,
  //   });
  //   activeAnimation.animations.forEach(d => console.log(d.keyframesString));

  //   setActiveAnimation(activeAnimation);
  //   setTimeout(() => resolveNewSnapshot(), activeAnimation.totalDuration - 20);
  // }
};
export default buildAnimationFromUpdateData;