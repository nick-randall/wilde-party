
const createNewFunc = () => {}
const createNewAsyncFunc = () => {}
const deleteAllFunc = () => {}
const updateFirstFunc = () => {}
const updateAllFunc = () => {}

export type UserActionType = "create" | "delete" | "update"
type CreateActions = "createNew" | "createNewAsync"
type DeleteActions = "deleteAll" 
type UpdateActions = "updateAll" | "updateFirst"

type UserActions =  CreateActions & DeleteActions & UpdateActions ;

type ActionFunction = Record<UserActions, () => void>

type CreateActionsObj = Record<UserActionType, ActionFunction>

const userActions: CreateActionsObj = {
  "create": {
    "createNew" : createNewFunc,
    "createNewAsync" :createNewAsyncFunc
  },
  "delete" : {
    "deleteAll": deleteAllFunc
  },
  "update" : {
    "updateFirst" : updateFirstFunc,
    "updateAll": updateAllFunc
  }
}

const actionTypes = userActions["delete"]
const deleteFunction: ActionFunction = actionTypes["deleteAll"]