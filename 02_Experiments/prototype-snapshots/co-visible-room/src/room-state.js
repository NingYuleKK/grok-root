const OBJECTS = {
  lamp: {
    name: "Lamp",
    idleLabel: "Dim",
    activeLabel: "Awake",
    observation: "The lamp is awake. A warm cone of light reaches the table."
  },
  desk: {
    name: "Desk",
    idleLabel: "Closed",
    activeLabel: "Open",
    observation: "The desk drawer is open. A folded note is visible inside."
  },
  window: {
    name: "Window",
    idleLabel: "Fogged",
    activeLabel: "Clear",
    observation: "The window clears. A thin blue streetlight appears outside."
  }
};

export function createRoomState() {
  return {
    objects: Object.fromEntries(
      Object.entries(OBJECTS).map(([id, object]) => [
        id,
        {
          ...object,
          discovered: false,
          inspections: 0
        }
      ])
    ),
    observations: [
      {
        objectId: "room",
        text: "The room is quiet. Three objects are waiting to be noticed."
      }
    ]
  };
}

export function inspectObject(state, objectId) {
  const object = state.objects[objectId];

  if (!object) {
    return state;
  }

  return {
    ...state,
    objects: {
      ...state.objects,
      [objectId]: {
        ...object,
        discovered: !object.discovered,
        inspections: object.inspections + 1
      }
    },
    observations: [
      ...state.observations,
      {
        objectId,
        text: object.observation
      }
    ]
  };
}
