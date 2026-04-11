Set-Location -Path "c:\Users\Treasure\Downloads\CampusGear\IT342_Abadinas_CampusGear"
git reset --soft HEAD~1
git reset

git add Backend\campusgear\campusgear\src\main\resources\application.properties
git add Backend\campusgear\campusgear\src\main\java\edu\cit\abadinas\campusgear\*\Product*.java
git commit -m "feat(backend): implement product catalog and listing endpoints" -q

git add Backend\campusgear\campusgear\src\main\java\edu\cit\abadinas\campusgear\*\Order*.java
git commit -m "feat(backend): add order processing, validation, and transaction management" -q

git add Backend\campusgear\campusgear\src\main\java\edu\cit\abadinas\campusgear\*\User*.java
git add Backend\campusgear\campusgear\src\main\java\edu\cit\abadinas\campusgear\*\Auth*.java
git add Backend\campusgear\campusgear\src\main\java\edu\cit\abadinas\campusgear\*\RefreshToken*.java
git add Backend\campusgear\campusgear\src\main\java\edu\cit\abadinas\campusgear\config\*.java
git add Backend\campusgear\campusgear\src\main\java\edu\cit\abadinas\campusgear\exception\*.java
git add Backend\campusgear\campusgear\src\main\java\edu\cit\abadinas\campusgear\dto\ProfileUpdateRequest.java
git commit -m "feat(backend): implement user profile endpoints and security config enhancements" -q

git add Web\CampusGear\src\services\api.js
git add Web\CampusGear\src\components\*
git add Web\CampusGear\src\App.jsx
git add Web\CampusGear\src\pages\Login.jsx
git add Web\CampusGear\src\pages\Register.jsx
git commit -m "feat(frontend): integrate api service and global routing architecture" -q

git add Web\CampusGear\src\pages\Dashboard.jsx
git add Web\CampusGear\src\pages\ProductDetail.jsx
git add Web\CampusGear\src\pages\AddListing.jsx
git add Web\CampusGear\src\pages\MyListings.jsx
git commit -m "feat(dashboard): build responsive product listing and management interfaces" -q

git add Web\CampusGear\src\pages\Checkout.jsx
git add Web\CampusGear\src\pages\BookingConfirmation.jsx
git commit -m "feat(checkout): implement secure rental booking and confirmation flow" -q

git add Web\CampusGear\src\pages\Profile.jsx
git add Web\CampusGear\src\pages\TransactionHistory.jsx
git commit -m "feat(profile): add user account module and transaction history tracking" -q

git add .
git commit -m "IT342 Phase 3 – Web Main Feature Completed" -q

git log --oneline -n 9
