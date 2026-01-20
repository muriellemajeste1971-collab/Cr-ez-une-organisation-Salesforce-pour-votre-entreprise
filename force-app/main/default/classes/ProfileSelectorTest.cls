@isTest
public class ProfileSelectorTest {

    @isTest
    static void testGetCurrentUserProfileName() {

        // Création d’un utilisateur de test via la factory
        User testUser = TestDataFactory.createTestUser();

        System.runAs(testUser) {
            String profileName = ProfileSelector.getCurrentUserProfileName();

            // Compatible FR / EN
            System.assert(
                profileName == 'System Administrator' ||
                profileName == 'Administrateur système',
                'Unexpected profile name: ' + profileName
            );
        }
    }
}
