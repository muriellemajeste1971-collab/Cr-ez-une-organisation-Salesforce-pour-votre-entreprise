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
}
