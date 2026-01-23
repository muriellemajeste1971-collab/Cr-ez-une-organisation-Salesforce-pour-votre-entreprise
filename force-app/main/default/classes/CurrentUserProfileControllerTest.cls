@isTest
public class CurrentUserProfileControllerTest {

    @isTest
    static void testGetCurrentUserProfile() {

        User testUser = TestDataFactory.createTestUser();

        System.runAs(testUser) {
            String profileName = CurrentUserProfileController.getCurrentUserProfile();
            System.assertEquals('Administrateur système', profileName);
        }
    }

    @isTest
    static void testGetCurrentUserProfileId() {
        User testUser = TestDataFactory.createTestUser();

        System.runAs(testUser) {
            String profileId = CurrentUserProfileController.getCurrentUserProfileId();

            // assert correct : on compare un Id avec un Id
            System.assertNotEquals(null, profileId);
        }
    }
}
