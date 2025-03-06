
export const handleNewServerSnapshots = (newServerSnapshots: NewServerSnapshots) => ({
    type: "HANDLE_NEW_SERVER_SNAPSHOTS",
    payload: newServerSnapshots,
});

export type HandleNewServerSnapshots = ReturnType<typeof handleNewServerSnapshots>;