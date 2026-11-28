import API from "../../../services/http";
import type { UserProfile } from "../types/profile";

const END_USER_ID = "2";

export function getCurrentUserProfile() {
    return API.get<UserProfile>(`/users/${END_USER_ID}`);
}
