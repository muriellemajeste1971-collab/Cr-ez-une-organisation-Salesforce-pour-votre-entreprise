public with sharing class CurrentUserProfileController {

    @AuraEnabled(cacheable=true)

    public static String getCurrentUserProfile() {
        return ProfileSelector.getCurrentUserProfileName();
    }


    @AuraEnabled(cacheable=true)
    public static String getCurrentUserProfileId() {
        return ProfileSelector.getCurrentUserProfileId();
    }
}
