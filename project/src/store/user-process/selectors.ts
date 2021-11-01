import {NameSpace} from '../root-reducer';
import {State} from '../../types/state';
import {AuthorizationStatus} from '../../const';

// state['USER'] - это отдельный стейт для юзера, а authorizationStatus - его ключ.
// getAuthorizationStatus = (общее состояние): перечисление => что-то из перечисления.
export const getAuthorizationStatus = (state: State): AuthorizationStatus => state[NameSpace.user].authorizationStatus;
