public with sharing class CurrentUserProfileController {

    @AuraEnabled(cacheable=true)
    public static String getCurrentUserProfile() {
        User u = [
            SELECT Profile.Name
            FROM User
            WHERE Id = :UserInfo.getUserId()
        ];
        return u.Profile.Name;
    }
}
