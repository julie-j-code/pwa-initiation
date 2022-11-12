// 1 La notification de permission doit nécessairement faire suite à une action. On ne peut pas la demander dès l'entrée sur l'application. Il faudra par ailleurs vérifier les permissions et n'afficher le bouton que si l'utilisateur ne les a pas déjà acceptées. 
function main() {
    const permission = document.getElementById('push-permission')
    if (!permission ||
        // si le système de notification n'existe pas ou que le Service Worker n'est pas supporté...
        !('Notification' in window) ||
        !('serviceWorker' in navigator) ||
        // si la requête de permission a déjà été autorisée (granted) ou refusée (denied)
        (Notification.permission != "default")
    ) {
        // on zappe
        return;
    }

    const button = document.createElement('button')
    button.innerText = 'Recevoir les notifications'
    permission.appendChild(button)
    button.addEventListener('click', askPermission)
}

// on va utiliser l'API Notification du navigateur

async function askPermission() {
    // console.log('Notification' in window)
    // cela affiche un popup, c'est la seconde étape
    const permission = await Notification.requestPermission()

    // si on n'avait pas déjà un sw.js, il faudrait impérativement en enregistrer un ---------
    // on en a un déjà actif à ce stade, alors je vais tenter d'en créer un second dédié aux notifications...
    if (permission == 'granted') {
    // est-ce que l'utilisateur n'est pas déjà abonné au système de notification push ?
    // le getSubscription renvoie les abonnements de l'utilisateur
    let subscription = await registration.pushManager.getSubscription();
    // en console, je devrais avoir un null, parce que l'utilisateur à ce stade n'est pas abonné aux notifications push
    console.log("subscription", subscription)
    // pour que l'utilisateur soit abonné, il faudra utiliser la méthode pushManager.subscribe() qui prend ntamment comme seconde option une clée applicationServerKey que je vais devoir récupérer au près d'un service push !!!!!!!!!!!!! 
    // https://developer.mozilla.org/en-US/docs/Web/API/PushManager/subscribe
    // en effet, lorsque nous faisons une demande de notification depuis le serveur, le service push doit s'assurer que c'est bien nous qui faisons la demande. Il faudra donc générer ces clés (clé privée + clée publique) 
    // parmis les packages utilisables pour un environnement php, https://packagist.org/packages/web-push-libs/web-push?query=web-push... Le plus utilisé étant https://packagist.org/packages/minishlink/web-push
    // on utilisera https://www.npmjs.com/package/web-push

    // pour anticiper la création de ces clés, voilà à quoi ressemblera la suite :
    // si pas d'abonnement, on en crée un nouveau
    if (!subscription) {
        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: "BJjLzRh-bZ0tll30z4c7eW1gLYr0m3rJCIch1DMRXhu8gQWTSMEKH2Ve6foqxM_G7kVbKTwBCsM7BtdXMxR8QSo"
        })
    }

    await saveSubscription(subscription)


    }
}


// webpush.setGCMAPIKey('<Your GCM API Key Here>');
// webpush.setVapidDetails(
//   'mailto:example@yourdomain.org',
//   vapidKeys.publicKey,
//   vapidKeys.privateKey
// );


// async function getPublicKey() {
//     const { key } = await fetch('/push/key', {
//         headers: {
//             Accept: 'application/json'
//         }
//     }).then(r => r.json())
//     return key
// }


// on passe à la fonction une instance de l'abonnement
async function saveSubscription(subscription) {
    // on utilisera de l'AJAX pour pouvoir contacter le serveur
    // à faire...
    console.log("enregistrement en cours...")

}

main()