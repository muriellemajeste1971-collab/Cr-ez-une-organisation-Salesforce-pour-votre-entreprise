public with sharing class ProfileSelector {

    public static String getCurrentUserProfileName() {
        User u = [
            SELECT Profile.Name
            FROM User
            WHERE Id = :UserInfo.getUserId()
            LIMIT 1
        ];
        return u.Profile.Name;
    }
}
