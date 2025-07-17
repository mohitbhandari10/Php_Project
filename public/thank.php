<?php
$first_name = isset($_GET['first_name']) ? htmlspecialchars($_GET['first_name']) : 'Customer';
$phone = isset($_GET['phone']) ? htmlspecialchars($_GET['phone']) : 'XXXXXXXXXX';
?>
<!DOCTYPE html>
<html lang="en">
<head>

    <meta charset="UTF-8">
    <title>Thank You for ordering - Order Confirmed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">

    <style>
        * {
            font-family: "Poppins", sans-serif;
        }

        .popup_7150_thanks {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 500px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 20px;
            z-index: 9999;
            text-align: center;
        }

        .popup_7150_thanks h3 {
            font-size: 18px;
            color: #333;
        }

        .popup_7150_thanks .highlight {
            color: #2d8a8f;
            font-weight: bold;
        }

        .popup_7150_thanks .buttons {
            margin-top: 20px;
        }

        .popup_7150_thanks .btn {
            padding: 10px 20px;
            margin: 5px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .popup_7150_thanks .btn-close {
            background-color: #f44336;
            color: white;
        }

        .popup_7150_thanks .btn-close:hover {
            background-color: #e41e1e;
        }

        .popup_7150_thanks .btn-contact {
            background-color: #4CAF50;
            color: white;
        }

        .popup_7150_thanks .btn-contact:hover {
            background-color: #45a049;
        }

        .overlay_7150_thanks {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9998;
        }
    </style>
 <!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '816614200229425');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=816614200229425&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
</head>
<body>

<!-- Binom Lead Trigger -->


<div class="overlay_7150_thanks" id="overlay_7150_thanks"></div>

<div class="popup_7150_thanks" id="popup_7150_thanks">
    <h3>THANK YOU <span class="highlight"><?php echo $first_name; ?></span><br><br>
        🎉 आपका ऑर्डर सफलतापूर्वक दर्ज कर लिया गया है। 🎉<br><br>
        📝 हमारे आयुर्वेदिक EXPERT आपसे इस नंबर <span class="highlight">+91-<?php echo ltrim($phone, '+91-'); ?></span> पर 09:00AM से शाम 06:00PM के बीच संपर्क करेंगे। 🕘<br><br>
        कृपया उन्हें अपनी समस्या के बारे में विस्तार से बताएँ ताकि वे आपके ऑर्डर को सही ढंग से संसाधित कर सकें।<br><br>
        🌿 कृपया अपना पूरा पता हमारे अधिकारी को उपलब्ध कराएँ ताकि आप अपना ऑर्डर आसानी से प्राप्त कर सकें। 🏠
    </h3>

    <div class="buttons">
        <a class="btn btn-contact" href="Contact us.html" style="text-decoration: none;">Contact Us</a>
        <button class="btn btn-close" onclick="closePopup()">Close</button>
    </div>
</div>

<script>
function closePopup() {
    document.getElementById('popup_7150_thanks').style.display = 'none';
    document.getElementById('overlay_7150_thanks').style.display = 'none';
    window.history.back();
}
</script>


</body>
</html>
