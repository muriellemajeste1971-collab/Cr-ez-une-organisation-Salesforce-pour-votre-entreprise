public with sharing class ProfileSelector {

    @AuraEnabled(cacheable=true)
    public static String getCurrentUserProfileName() {
        return [
            SELECT Profile.Name
            FROM User
            WHERE Id = :UserInfo.getUserId()
            LIMIT 1
        ].Profile.Name;
    }

    @AuraEnabled(cacheable=true)
    public static String getCurrentUserProfileId() {
        return UserInfo.getProfileId();
    }
}
