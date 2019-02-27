const Discord = require('discord.js')
const client = new Discord.Client()
const Command = require('../libhorizon/commandRt')
let loginfo = "nothing"
var config = require('../config/config.json')
const fs = require('fs');
const os = require('os');
const shard = new Discord.ShardClientUtil(client);
const mode = require('../config/mode.json')
var JsonDB = require('node-json-db');
var db = new JsonDB("horigame/db.json", true, true);
let lstmsg
const talkedRecently = new Set();
const xpCooldown = new Set();
const translate = require('@vitalets/google-translate-api');


module.exports = class Horigame extends Command {

    static match(message) {
        if (config.enableHorigame) {
            if (message.guild) {
            if (message.content.startsWith("hg ")) {
                if (talkedRecently.has(message.author.id)) {
                    lstmsg = message
                    blockMessage();
                } else {
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                talkedRecently.delete(message.author.id);
                }, 5000);
            if (message.content == 'hg init') {
                try {
                    var data = db.getData("/game/" + message.author.id);
                } catch(error) {
                    lstmsg = message
                    initUser();
                };
                if (data) {
                message.channel.send(":no_entry: Le profil utilisateur de **" + message.author.username + "** existe déjà. Utilisez `hg reset` pour le réinitialiser")
            }}else{
                if (message.content == 'hg stats') {
                    try {
                        var data = db.getData("/game/" + message.author.id);
                    } catch(error) {
                        lstmsg = message
                        initErr();
                    };
                    if (data) {
                    var level = db.getData("/game/" + message.author.id + "/level")
                    var xp = db.getData("/game/" + message.author.id + "/xp")
                    var diamonds = db.getData("/game/" + message.author.id + "/objects/diamonds")
                    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
                    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
                    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
                    var xpBottle = db.getData("/game/" + message.author.id + "/bonus/xpBottle")
                    var goldPack = db.getData("/game/" + message.author.id + "/bonus/goldPack")
                    var ironPack = db.getData("/game/" + message.author.id + "/bonus/ironPack")
                    var woodPack = db.getData("/game/" + message.author.id + "/bonus/woodPack")
                    var totalXp = xp + ( level * 500 )
                    var admin = false;
                    try {
                        admin = db.getData("/game/" + message.author.id + "/admin");
                    } catch(error) {};
                    if (admin === true) { var adminMsg = "\n\n:watch: **__Attention__, vous êtes un administrateur de Horigame !**" } else { var adminmsg = "" }
                    message.channel.send(":open_hands: **Bonjour " + message.author.username + ", voici vos statistiques :**"  + adminMsg +"\n\n:arrow_upper_right: **Niveau** : " + level + "\n:level_slider: **Points d'expérience pour ce niveau** : " + xp + "/500\n:up: **Total des points d'expérience** : " + totalXp + "\n:large_blue_diamond: **Diamants dans l'inventaire** : " + diamonds + "\n:large_orange_diamond: **Pépites d'or dans l'inventaire** : " + golds + "\n:flag_white: **Lingots de fer dans l'inventaire** : " + irons + "\n:pick:  **Planches de bois dans l'inventaire** : " + woods + "\n:milk: **Fioles d'expérience dans l'inventaire Bonus** : " + xpBottle + "\n:package: **Packs de *bois* dans l'inventaire Bonus** : " + woodPack + "\n:package: **Packs de *fer* dans l'inventaire Bonus** : " + ironPack + "\n:package: **Packs d'*or* dans l'inventaire Bonus** : " + goldPack)
                }}else{
                    if (message.content == 'hg reset') {
                        try {
                            var data = db.getData("/game/" + message.author.id);
                        } catch(error) {
                            lstmsg = message
                            initErr();
                        };
                        message.channel.send(":warning: Vous vous apprêtez à réinitialiser le profil utilisateur de **" + message.author.username + "**. Cette action est __irréversible__. **__SOYEZ BIEN SUR DE CE QUE VOUS FAITES !!!__**. Pour continuer tout de même, envoyez `hg reset --yes-i-know-what-im-doing`")
                    }else{
                        if (message.content == 'hg reset --yes-i-know-what-im-doing') {
                            try {
                                var data = db.getData("/game/" + message.author.id);
                            } catch(error) {
                                lstmsg = message
                                initErr();
                            };
                            message.channel.send(":file_cabinet: Le profil de **" + message.author.username + "** est en cours de réinitialisation, patientez...")
                            db.push("/game/" + message.author.id + "/level", 0);
                            db.push("/game/" + message.author.id + "/xp", 20);
                            db.push("/game/" + message.author.id + "/objects/diamonds", 0);
                            db.push("/game/" + message.author.id + "/objects/irons", 0);
                            db.push("/game/" + message.author.id + "/objects/golds", 0);
                            db.push("/game/" + message.author.id + "/objects/woods", 5);
                            db.push("/game/" + message.author.id + "/bonus/xpBottle", 0);
                            db.push("/game/" + message.author.id + "/bonus/ironPack", 0);
                            db.push("/game/" + message.author.id + "/bonus/goldPack", 0);
                            db.push("/game/" + message.author.id + "/bonus/woodPack", 0);
                            message.channel.send(":white_check_mark: Le profil utilisateur de **" + message.author.username + "** a été restauré aux valeurs par défaut.")
                        }else{
            if (message.content == 'hg reset --yes-i-know-what-im-doing') {
                try {
                    var data = db.getData("/game/" + message.author.id);
                } catch(error) {
                    lstmsg = message
                    initErr();
                };
                message.channel.send(":file_cabinet: Le profil de **" + message.author.username + "** est en cours de réinitialisation, patientez...")
                db.push("/game/" + message.author.id + "/level", 0);
                db.push("/game/" + message.author.id + "/xp", 20);
                db.push("/game/" + message.author.id + "/objects/diamonds", 0);
                db.push("/game/" + message.author.id + "/objects/irons", 0);
                db.push("/game/" + message.author.id + "/objects/golds", 0);
                db.push("/game/" + message.author.id + "/objects/woods", 5);
                db.push("/game/" + message.author.id + "/bonus/xpBottle", 0);
                db.push("/game/" + message.author.id + "/bonus/ironPack", 0);
                db.push("/game/" + message.author.id + "/bonus/goldPack", 0);
                db.push("/game/" + message.author.id + "/bonus/woodPack", 0);
                message.channel.send(":white_check_mark: Le profil utilisateur de **" + message.author.username + "* a été restauré aux valeurs par défaut.")
            }else{
                if (message.content == 'hg shop') {
                    try {
                        var data = db.getData("/game/" + message.author.id);
                    } catch(error) {
                        lstmsg = message
                        initErr();
                    };
                    if (data) {
                    var diamonds = db.getData("/game/" + message.author.id + "/objects/diamonds")
                    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
                    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
                    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
                    var xp = db.getData("/game/" + message.author.id + "/xp")
                    message.channel.send(":shopping_bags: **Bienvenue dans la boutique Plug², " + message.author.username + " ! Voici les articles que nous avons actuellement :**\n\n:shopping_cart: **En stock :**\n1 :: `5⛏` :: 1 lingot de fer\n2 :: `5🏳️` :: 1 pépite d'or\n3 :: `5🔶` :: 1 diamant\n4 :: `3🔷` :: Grade Pionnier\n\n:gift: **Donner en cadeau :**\n1 :: `10⛏` :: Donner 10 planches de bois\n2 :: `10🏳️` :: Donner 10 lingots de fer\n3 :: `10🔶` :: Donner 10 pépites d'or\n4 :: `10🎚` :: Donner 10 points d'expérience\n\n:moneybag: **Votre solde :**\n     :level_slider: **Points d'expérience pour le niveau actuel** : " + xp + "/500\n     :large_blue_diamond: **Diamants** : " + diamonds + "\n     :large_orange_diamond: **Pépites d'or** : " + golds + "\n     :flag_white: **Lingots de fer** : " + irons + "\n     :pick: **Planches de bois** : " + woods + "\n\n**Commandes :**\nAcheter un article : `hg shop [IdentifiantArticle]`\nFaire un cadeau : `hg give [IdentifiantCadeau] [MentionUtilisateur]`\nRécupérer les cadeaux : `hg redeem`")
                }}else{
                if (message.content.startsWith("hg shop ")) {
                    lstmsg = message
                    checkShop();
                }else{
                    if (message.content.startsWith("hg give ")) {
                        lstmsg = message
                        checkGift();
                    }else{
                        if (message.content == 'hg give') {
                            message.channel.send(":gift: **`hg give` permet de faire un don à un membre**\n\n**Syntaxe :**\n       `hg give <IdentifiantCadeau> <MentionUtilisateur>`\n\n**Conditions :**\n       **1.** L'identifiant cadeau doit être valide. Vous pouvez utiliser `hg shop` pour en savoir plus...\n       **2.** L'utilisateur doit être présent sur le serveur\n       **3.** L'utilisateur doit déjà avoir initialisé son profil")
                        }else{
                            if (message.content == 'hg redeem') {
                                try {
                                    var data = db.getData("/game/" + message.author.id);
                                } catch(error) {
                                    lstmsg = message
                                    initErr();
                                };
                                if (data) {
                                    var goldPack = db.getData("/game/" + message.author.id + "/bonus/goldPack")
                                    var ironPack = db.getData("/game/" + message.author.id + "/bonus/ironPack")
                                    var woodPack = db.getData("/game/" + message.author.id + "/bonus/woodPack")
                                    var xpBottle = db.getData("/game/" + message.author.id + "/bonus/xpBottle")
                                    var xp = db.getData("/game/" + message.author.id + "/xp")
                                    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
                                    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
                                    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
                                    if (xpBottle >= 1 || woodPack >= 1 || ironPack >= 1 || goldPack >= 1) {
                                        if (xpBottle >= 1) {
                                            var gainXp = xpBottle * 10
                                            db.push("/game/" + message.author.id + "/xp", xp + (xpBottle * 10))
                                            db.push("/game/" + message.author.id + "/bonus/xpBottle", 0)
                                        }else{
                                            var gainXp = 0
                                        }
                                        if (woodPack >= 1) {
                                            var gainWood = woodPack * 10
                                            db.push("/game/" + message.author.id + "/objects/woods", woods + (woodPack * 10))
                                            db.push("/game/" + message.author.id + "/bonus/woodPack", 0)
                                        }else{
                                            var gainWood = 0
                                        }
                                        if (ironPack >= 1) {
                                            var gainIron = ironPack * 10
                                            db.push("/game/" + message.author.id + "/objects/irons", irons + (ironPack * 10))
                                            db.push("/game/" + message.author.id + "/bonus/ironPack", 0)
                                        }else{
                                            var gainIron = 0
                                        }
                                        if (goldPack >= 1) {
                                            var gainGold = goldPack * 10
                                            db.push("/game/" + message.author.id + "/objects/irons", golds + (goldPack * 10))
                                            db.push("/game/" + message.author.id + "/bonus/goldPack", 0)
                                        }else{
                                            var gainGold = 0
                                        }
                                        message.channel.send(":gift: **Tous les packets ont bien été ouverts !**\n\n__**Résultats :**__\n**+" + gainXp + "** points d'expérience\n**+" + gainWood + "** planches de bois\n**+" + gainIron + "** lingots de fer\n**+" + gainGold + "** pépites d'or")
                                    }else{
                                        message.channel.send(":no_entry: Vous n'avez aucun lot Bonus à récupérer...")
                                    }
                                }
                            }else{
                if (message.content.startsWith('hg te ')) {
                    let args = message.content.split(' ');
                    args.shift();
                    let part1 = args.join(' ')
                    args = part1.split(' ');
                    args.shift();
                    let text = args.join(' ')
                    translate(text, {to: 'en'}).then(res => {
                        if (res.from.language.iso) {
                            if (res.from.language.iso == "fr") { var language = "le **français**" }
                            if (res.from.language.iso == "en") { var language = "l'**anglais**" }
                            if (res.from.language.iso == "nl") { var language = "le **néerlandais**" }
                            if (res.from.language.iso == "es") { var language = "l'**espagnol**" }
                            if (res.from.language.iso == "ja") { var language = "le **japonais**" }
                            if (res.from.language.iso == "af") { var language = "l'**afriquain**" }
                            if (res.from.language.iso == "ca") { var language = "le **catalan**" }
                            if (res.from.language.iso == "co") { var language = "le **corse**" }
                            if (res.from.language.iso == "cs") { var language = "le **tchèque**" }
                            if (res.from.language.iso == "da") { var language = "le **danois**" }
                            if (res.from.language.iso == "de") { var language = "l'**allemand**" }
                            if (res.from.language.iso == "fi") { var language = "le **finnois**" }
                            if (res.from.language.iso == "hr") { var language = "le **croate**" }
                            if (res.from.language.iso == "ie") { var language = "la **langue occidentale**" }
                            if (res.from.language.iso == "it") { var language = "l'**italien**" }
                            if (res.from.language.iso == "ko") { var language = "le **coréen**" }
                            if (res.from.language.iso == "la") { var language = "le **latin**" }
                            if (res.from.language.iso == "pl") { var language = "le **polonais**" }
                            if (res.from.language.iso == "pt") { var language = "le **portugais**" }
                            if (res.from.language.iso == "sk") { var language = "le **slovaque**" }
                            if (res.from.language.iso == "sv") { var language = "le **suédois**" }
                            if (res.from.language.iso == "tr") { var language = "le **turc**" }
                            if (res.from.language.iso == "ty") { var language = "le **tahitien**" }
                            if (res.from.language.iso == "tr") { var language = "le **turc**" }
                            if (res.from.language.iso == "uk") { var language = "l'**ukrainien**" }
                            if (res.from.language.iso == "zh") { var language = "le **chinois**" }
                        }else{
                            var language = "plusieurs langues"
                        }
                        if (res.from.text.autoCorrected == true) {
                            if (language === undefined) { var language = "plusieurs langues" }
                            message.channel.send(":arrow_right: " + res.text + "\n:warning: Traduit de **" + res.from.text.value + "**, corrigé automatiquement\n:information_source: Traduit depuis " + language);
                        }else{
                            if (res.from.text.didYouMean) {
                                if (language === undefined) { var language = "plusieurs langues" }
                                message.channel.send(":arrow_right: " + res.text + "\n:warning: Essayez avec cette orthographe **" + res.from.text.value + "**...\n:information_source: Traduit depuis " + language);
                            }else{
                                if (res.text) {
                                    if (language === undefined) { var language = "plusieurs langues" }
                    message.channel.send(":arrow_right: " + res.text + "\n:information_source: Traduit depuis " + language);}else{
                        message.channel.send(":no_entry: Aucun résultat pour **" + res.from.text.value + "**")
                    }
                }}}).catch(err => {
                    message.channel.send(":no_entry: **Désolé**, mais une erreur s'est produite :\n```\n" + err + "\n```");
                    console.log(err);
                });
                }else{
                    if (message.content.startsWith('hg tf ')) {
                        let args = message.content.split(' ');
                        args.shift();
                        let part1 = args.join(' ')
                        args = part1.split(' ');
                        args.shift();
                        let text = args.join(' ')
                        translate(text, {to: 'fr'}).then(res => {
                            if (res.from.language.iso) {
                                if (res.from.language.iso == "fr") { var language = "le **français**" }
                                if (res.from.language.iso == "en") { var language = "l'**anglais**" }
                                if (res.from.language.iso == "nl") { var language = "le **néerlandais**" }
                                if (res.from.language.iso == "es") { var language = "l'**espagnol**" }
                                if (res.from.language.iso == "ja") { var language = "le **japonais**" }
                                if (res.from.language.iso == "af") { var language = "l'**afriquain**" }
                                if (res.from.language.iso == "ca") { var language = "le **catalan**" }
                                if (res.from.language.iso == "co") { var language = "le **corse**" }
                                if (res.from.language.iso == "cs") { var language = "le **tchèque**" }
                                if (res.from.language.iso == "da") { var language = "le **danois**" }
                                if (res.from.language.iso == "de") { var language = "l'**allemand**" }
                                if (res.from.language.iso == "fi") { var language = "le **finnois**" }
                                if (res.from.language.iso == "hr") { var language = "le **croate**" }
                                if (res.from.language.iso == "ie") { var language = "la **langue occidentale**" }
                                if (res.from.language.iso == "it") { var language = "l'**italien**" }
                                if (res.from.language.iso == "ko") { var language = "le **coréen**" }
                                if (res.from.language.iso == "la") { var language = "le **latin**" }
                                if (res.from.language.iso == "pl") { var language = "le **polonais**" }
                                if (res.from.language.iso == "pt") { var language = "le **portugais**" }
                                if (res.from.language.iso == "sk") { var language = "le **slovaque**" }
                                if (res.from.language.iso == "sv") { var language = "le **suédois**" }
                                if (res.from.language.iso == "tr") { var language = "le **turc**" }
                                if (res.from.language.iso == "ty") { var language = "le **tahitien**" }
                                if (res.from.language.iso == "tr") { var language = "le **turc**" }
                                if (res.from.language.iso == "uk") { var language = "l'**ukrainien**" }
                                if (res.from.language.iso == "zh") { var language = "le **chinois**" }
                            }else{
                                var language = "plusieurs langues"
                            }
                            if (res.from.text.autoCorrected == true) {
                                if (language === undefined) { var language = "plusieurs langues" }
                                message.channel.send(":arrow_right: " + res.text + "\n:warning: Traduit de **" + res.from.text.value + "**, corrigé automatiquement\n:information_source: Traduit depuis " + language);
                            }else{
                                if (res.from.text.didYouMean) {
                                    if (language === undefined) { var language = "plusieurs langues" }
                                    message.channel.send(":arrow_right: " + res.text + "\n:warning: Essayez avec cette orthographe **" + res.from.text.value + "**...\n:information_source: Traduit depuis " + language);
                                }else{
                                    if (res.text) {
                                        if (language === undefined) { var language = "plusieurs langues" }
                        message.channel.send(":arrow_right: " + res.text + "\n:information_source: Traduit depuis " + language);}else{
                            message.channel.send(":no_entry: Aucun résultat pour **" + res.from.text.value + "**")
                        }
                    }}}).catch(err => {
                        message.channel.send(":no_entry: **Désolé**, mais une erreur s'est produite :\n```\n" + err + "\n```");
                        console.log(err);
                    });
                    }else{
                        if (message.content.startsWith('hg tj ')) {
                            let args = message.content.split(' ');
                            args.shift();
                            let part1 = args.join(' ')
                            args = part1.split(' ');
                            args.shift();
                            let text = args.join(' ')
                            translate(text, {to: 'ja'}).then(res => {
                                if (res.from.language.iso) {
                                    if (res.from.language.iso == "fr") { var language = "le **français**" }
                                    if (res.from.language.iso == "en") { var language = "l'**anglais**" }
                                    if (res.from.language.iso == "nl") { var language = "le **néerlandais**" }
                                    if (res.from.language.iso == "es") { var language = "l'**espagnol**" }
                                    if (res.from.language.iso == "ja") { var language = "le **japonais**" }
                                    if (res.from.language.iso == "af") { var language = "l'**afriquain**" }
                                    if (res.from.language.iso == "ca") { var language = "le **catalan**" }
                                    if (res.from.language.iso == "co") { var language = "le **corse**" }
                                    if (res.from.language.iso == "cs") { var language = "le **tchèque**" }
                                    if (res.from.language.iso == "da") { var language = "le **danois**" }
                                    if (res.from.language.iso == "de") { var language = "l'**allemand**" }
                                    if (res.from.language.iso == "fi") { var language = "le **finnois**" }
                                    if (res.from.language.iso == "hr") { var language = "le **croate**" }
                                    if (res.from.language.iso == "ie") { var language = "la **langue occidentale**" }
                                    if (res.from.language.iso == "it") { var language = "l'**italien**" }
                                    if (res.from.language.iso == "ko") { var language = "le **coréen**" }
                                    if (res.from.language.iso == "la") { var language = "le **latin**" }
                                    if (res.from.language.iso == "pl") { var language = "le **polonais**" }
                                    if (res.from.language.iso == "pt") { var language = "le **portugais**" }
                                    if (res.from.language.iso == "sk") { var language = "le **slovaque**" }
                                    if (res.from.language.iso == "sv") { var language = "le **suédois**" }
                                    if (res.from.language.iso == "tr") { var language = "le **turc**" }
                                    if (res.from.language.iso == "ty") { var language = "le **tahitien**" }
                                    if (res.from.language.iso == "tr") { var language = "le **turc**" }
                                    if (res.from.language.iso == "uk") { var language = "l'**ukrainien**" }
                                    if (res.from.language.iso == "zh") { var language = "le **chinois**" }
                                }else{
                                    var language = "plusieurs langues"
                                }
                                if (res.from.text.autoCorrected == true) {
                                    if (language === undefined) { var language = "plusieurs langues" }
                                    message.channel.send(":arrow_right: " + res.text + "\n:warning: Traduit de **" + res.from.text.value + "**, corrigé automatiquement\n:information_source: Traduit depuis " + language);
                                }else{
                                    if (res.from.text.didYouMean) {
                                        if (language === undefined) { var language = "plusieurs langues" }
                                        message.channel.send(":arrow_right: " + res.text + "\n:warning: Essayez avec cette orthographe **" + res.from.text.value + "**...\n:information_source: Traduit depuis " + language);
                                    }else{
                                        if (res.text) {
                                            if (language === undefined) { var language = "plusieurs langues" }
                            message.channel.send(":arrow_right: " + res.text + "\n:information_source: Traduit depuis " + language);}else{
                                message.channel.send(":no_entry: Aucun résultat pour **" + res.from.text.value + "**")
                            }
                        }}}).catch(err => {
                            message.channel.send(":no_entry: **Désolé**, mais une erreur s'est produite :\n```\n" + err + "\n```");
                            console.log(err);
                        });
                        }else{
                            if (message.content.startsWith('hg tl ')) {
                                let args = message.content.split(' ');
                                args.shift();
                                let part1 = args.join(' ')
                                args = part1.split(' ');
                                args.shift();
                                let text = args.join(' ')
                                translate(text, {to: 'la'}).then(res => {
                                    if (res.from.language.iso) {
                                        if (res.from.language.iso == "fr") { var language = "le **français**" }
                                        if (res.from.language.iso == "en") { var language = "l'**anglais**" }
                                        if (res.from.language.iso == "nl") { var language = "le **néerlandais**" }
                                        if (res.from.language.iso == "es") { var language = "l'**espagnol**" }
                                        if (res.from.language.iso == "ja") { var language = "le **japonais**" }
                                        if (res.from.language.iso == "af") { var language = "l'**afriquain**" }
                                        if (res.from.language.iso == "ca") { var language = "le **catalan**" }
                                        if (res.from.language.iso == "co") { var language = "le **corse**" }
                                        if (res.from.language.iso == "cs") { var language = "le **tchèque**" }
                                        if (res.from.language.iso == "da") { var language = "le **danois**" }
                                        if (res.from.language.iso == "de") { var language = "l'**allemand**" }
                                        if (res.from.language.iso == "fi") { var language = "le **finnois**" }
                                        if (res.from.language.iso == "hr") { var language = "le **croate**" }
                                        if (res.from.language.iso == "ie") { var language = "la **langue occidentale**" }
                                        if (res.from.language.iso == "it") { var language = "l'**italien**" }
                                        if (res.from.language.iso == "ko") { var language = "le **coréen**" }
                                        if (res.from.language.iso == "la") { var language = "le **latin**" }
                                        if (res.from.language.iso == "pl") { var language = "le **polonais**" }
                                        if (res.from.language.iso == "pt") { var language = "le **portugais**" }
                                        if (res.from.language.iso == "sk") { var language = "le **slovaque**" }
                                        if (res.from.language.iso == "sv") { var language = "le **suédois**" }
                                        if (res.from.language.iso == "tr") { var language = "le **turc**" }
                                        if (res.from.language.iso == "ty") { var language = "le **tahitien**" }
                                        if (res.from.language.iso == "tr") { var language = "le **turc**" }
                                        if (res.from.language.iso == "uk") { var language = "l'**ukrainien**" }
                                        if (res.from.language.iso == "zh") { var language = "le **chinois**" }
                                    }else{
                                        var language = "plusieurs langues"
                                    }
                                    if (res.from.text.autoCorrected == true) {
                                        if (language === undefined) { var language = "plusieurs langues" }
                                        message.channel.send(":arrow_right: " + res.text + "\n:warning: Traduit de **" + res.from.text.value + "**, corrigé automatiquement\n:information_source: Traduit depuis " + language);
                                    }else{
                                        if (res.from.text.didYouMean) {
                                            if (language === undefined) { var language = "plusieurs langues" }
                                            message.channel.send(":arrow_right: " + res.text + "\n:warning: Essayez avec cette orthographe **" + res.from.text.value + "**...\n:information_source: Traduit depuis " + language);
                                        }else{
                                            if (res.text) {
                                                if (language === undefined) { var language = "plusieurs langues" }
                                message.channel.send(":arrow_right: " + res.text + "\n:information_source: Traduit depuis " + language);}else{
                                    message.channel.send(":no_entry: Aucun résultat pour **" + res.from.text.value + "**")
                                }
                            }}}).catch(err => {
                                message.channel.send(":no_entry: **Désolé**, mais une erreur s'est produite :\n```\n" + err + "\n```");
                                console.log(err);
                            });
                            }else{
            message.channel.send(":no_entry_sign: **" + message.content + "** n'est pas reconnu en tant que commande interne de Horigame. Vérifiez l'orthographe et réessayez. - `" + message.author.username + "`")
}}}}}}}}}}}}}}}}
try {
    var data = db.getData("/game/" + message.author.id);
} catch(error) {
};
if (data) {
    if (xpCooldown.has(message.author.id)) {blockXpUp();} else {
        xpCooldown.add(message.author.id);
    setTimeout(() => {
        xpCooldown.delete(message.author.id);
      }, 60000);
    var userXp = db.getData("/game/" + message.author.id + "/xp");
    db.push("/game/" + message.author.id + "/xp", userXp + 10);
    var userXp = db.getData("/game/" + message.author.id + "/xp");
    if (userXp >= 500) {
        var userLevel = db.getData("/game/" + message.author.id + "/level");
        db.push("/game/" + message.author.id + "/level", userLevel + 1);
        db.push("/game/" + message.author.id + "/xp", 0);
        var planks = db.getData("/game/" + message.author.id + "/objects/woods");
        db.push("/game/" + message.author.id + "/objects/woods", planks + 15);
        var userLevel = db.getData("/game/" + message.author.id + "/level");
        message.author.send(":tools: Salut **" + message.author.username + "**, tu es maintenant au **niveau " + userLevel + "** ! Félicitations ! *(et tu gagne 15 planches de bois)*")
    }
}}}}}}

function blockXpUp () {
    //Ne rien faire, juste empêcher l'utilisateur de gagner de l'expérience...
};

function blockMessage() {
    lstmsg.channel.send(":warning: N'allez pas si vite ! Recommencez dans quelques secondes...");
};

function initErr() {
    lstmsg.channel.send(":no_entry: Aucun profil utilisateur correspondant à **" + lstmsg.author.username + "** n'a été trouvé. Exécutez la commande `hg init` pour en générer un...")
};

function initUser() {
    lstmsg.channel.send(":clock1: Patientez... L'initialisation du profil utilisateur de **" + lstmsg.author.username + "** est en cours...")
                db.push("/game/" + lstmsg.author.id + "/level", 0);
                db.push("/game/" + lstmsg.author.id + "/xp", 20);
                db.push("/game/" + lstmsg.author.id + "/objects/diamonds", 0);
                db.push("/game/" + lstmsg.author.id + "/objects/irons", 0);
                db.push("/game/" + lstmsg.author.id + "/objects/golds", 0);
                db.push("/game/" + lstmsg.author.id + "/objects/woods", 5);
                db.push("/game/" + lstmsg.author.id + "/bonus/xpBottle", 0);
                db.push("/game/" + lstmsg.author.id + "/bonus/ironPack", 0);
                db.push("/game/" + lstmsg.author.id + "/bonus/goldPack", 0);
                db.push("/game/" + lstmsg.author.id + "/bonus/woodPack", 0);
                lstmsg.channel.send(":white_check_mark: Votre profil utilisateur à été initialisé correctement, vous pouvez maintenant commencer à jouer ! - `" + lstmsg.author.username + "`")
}

function checkShop() {
    let message = lstmsg
    let args = message.content.split(' ');
    args.shift();
    let object = args.join(' ')
    args = object.split(' ');
    args.shift();
    let selection = args.join(' ')
    var diamonds = db.getData("/game/" + message.author.id + "/objects/diamonds")
    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
    var xp = db.getData("/game/" + message.author.id + "/xp")
    if (selection == "1") {
        if (woods >= 5) {
            db.push("/game/" + message.author.id + "/objects/woods", woods - 5);
            db.push("/game/" + message.author.id + "/objects/irons", irons + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            message.channel.send(":white_check_mark: Votre commande *#" + commandId + "* de **1 lingot de fer** a été validée - `" + message.author.username + "`")
            loginfo = "Commande #" + commandId + " de l'objet " + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            message.channel.send(":no_entry: Votre solde actuel (**" + woods + " planches de bois**) n'est pas suffisant. Pour acheter cet article, vous devez avoir au moins **5 planches de bois**.")
        }
    }else if (selection == "2") {
        if (irons >= 5) {
            db.push("/game/" + message.author.id + "/objects/irons", irons - 5);
            db.push("/game/" + message.author.id + "/objects/golds", golds + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            message.channel.send(":white_check_mark: Votre commande *#" + commandId + "* de **1 pépite d'or** a été validée - `" + message.author.username + "`")
            loginfo = "Commande #" + commandId + " de l'objet " + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            message.channel.send(":no_entry: Votre solde actuel (**" + irons + " lingots de fer**) n'est pas suffisant. Pour acheter cet article, vous devez avoir au moins **5 lingots de fer**.")
        }
    }else if (selection == "3") {
        if (golds >= 5) {
            db.push("/game/" + message.author.id + "/objects/golds", golds - 5);
            db.push("/game/" + message.author.id + "/objects/diamonds", diamonds + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            message.channel.send(":white_check_mark: Votre commande *#" + commandId + "* de **1 diamant** a été validée - `" + message.author.username + "`")
            loginfo = "Commande #" + commandId + " de l'objet " + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            message.channel.send(":no_entry: Votre solde actuel (**" + golds + " pépites d'or**) n'est pas suffisant. Pour acheter cet article, vous devez avoir au moins **5 pépites d'or**.")
        }
    }else if (selection == "4") {
        if (diamonds >= 3) {
            if (message.member.roles.find("id", config.pionnerRoleID)) {
                message.channel.send(":no_entry: Vous disposez déjà de cet article. Vous ne pouvez disposez que d'une seule unité de ce dernier.")
            }else{
            db.push("/game/" + message.author.id + "/objects/golds", diamonds - 3);
            message.member.addRole(config.pionnerRoleID,"A acheté via la Boutique Plug²")
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(1000000, 999999999);
            message.channel.send(":white_check_mark: Votre commande *#" + commandId + "* du **grade Pionnier** a été validée - `" + message.author.username + "`")
            loginfo = "Commande #" + commandId + " de l'objet " + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }}else{
            message.channel.send(":no_entry: Votre solde actuel (**" + diamonds + " diamants**) n'est pas suffisant. Pour acheter cet article, vous devez avoir au moins **3 diamants**.")
        }
    }else{
    message.channel.send(":no_entry_sign: L'article **" + selection + "** n'est pas ou plus disponible dans la **Boutique Plug²**. Vérifiez l'orthographe et réessayez. - `" + message.author.username + "`")
}}

function checkGift() {
    let message = lstmsg
    let args = message.content.split(' ');
    args.shift();
    let object = args.join(' ')
    args = object.split(' ');
    args.shift();
    let selection = args.join(' ')
    var golds = db.getData("/game/" + message.author.id + "/objects/golds")
    var irons = db.getData("/game/" + message.author.id + "/objects/irons")
    var woods = db.getData("/game/" + message.author.id + "/objects/woods")
    var xp = db.getData("/game/" + message.author.id + "/xp")
    var invalidUser = false
    try {
        var destUser = message.mentions.users.first().id
        var reciever = message.mentions.users.first()
    } catch(error) {
        lstmsg = message
        invalidUser = true;
    }
    try {
        var testing = db.getData("/game/" + destUser)
    } catch(error) {
        lstmsg = message
        invalidUser = true;
    }
    if (invalidUser === true) {
        giftInvalidUser();
    }
    if (destUser && testing) {
        var givenItself = false;
    if (destUser == message.author.id) {
        lstmsg = message
        giftCannotGiveYourself();
        givenItself = true;
    }
    if (givenItself === false) {
    if (selection.startsWith("1")) {
        if (woods >= 10) {
            db.push("/game/" + message.author.id + "/objects/woods", woods - 10);
            var destWoods = db.getData("/game/" + destUser + "/bonus/woodPack")
            db.push("/game/" + destUser + "/bonus/woodPack", destWoods + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(100, 99999);
            message.channel.send(":white_check_mark: Votre don *#" + commandId + "* de **10 planches de bois** pour **" + reciever.username + "** a été validé - `" + message.author.username + "`")
            reciever.send("🔔 Vous avez reçu un **pack de 10 planches de bois** de la part de **" + message.author.username + "**. Utilisez la commande `hg redeem` pour les récupérer...")
            loginfo = "Commande #" + commandId + " de l'objet donation-" + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            message.channel.send(":no_entry: Votre solde actuel (**" + woods + " planches de bois**) n'est pas suffisant. Pour effectuer un don, vous devez avoir au moins **10 planches de bois**.")
        }}else if (selection.startsWith("2")) {
            if (irons >= 10) {
                db.push("/game/" + message.author.id + "/objects/irons", irons - 10);
                var destIrons = db.getData("/game/" + destUser + "/bonus/ironPack")
                db.push("/game/" + destUser + "/bonus/ironPack", destIrons + 1);
                function getRandomArbitrary(min, max) {
                    return Math.random() * (max - min) + min;
                }
                var commandId = getRandomArbitrary(100, 99999);
                message.channel.send(":white_check_mark: Votre don *#" + commandId + "* de **10 lingots de fer** pour **" + message.mentions.user.first().username + "** a été validé - `" + message.author.username + "`")
                message.mentions.user.first().send("🔔 Vous avez reçu un **pack de 10 lingots de fer** de la part de **" + message.author.username + "**. Utilisez la commande `hg redeem` pour les récupérer...")
                loginfo = "Commande #" + commandId + " de l'objet donation-" + selection + " effectuée par " + message.author.username + " validée"
                showLog();
            }else{
                message.channel.send(":no_entry: Votre solde actuel (**" + irons + " lingots de fer**) n'est pas suffisant. Pour effectuer un don, vous devez avoir au moins **10 lingots de fer**.")
            }
    }else if (selection.startsWith("3")) {
            if (golds >= 10) {
                db.push("/game/" + message.author.id + "/objects/golds", golds - 10);
                var destGolds = db.getData("/game/" + destUser + "/bonus/goldPack")
                db.push("/game/" + destUser + "/bonus/goldPack", destGolds + 1);
                function getRandomArbitrary(min, max) {
                    return Math.random() * (max - min) + min;
                }
                var commandId = getRandomArbitrary(100, 99999);
                message.channel.send(":white_check_mark: Votre don *#" + commandId + "* de **10 pépites d'or** pour **" + message.mentions.user.first().username + "** a été validé - `" + message.author.username + "`")
                message.mentions.user.first().send("🔔 Vous avez reçu un **pack de 10 pépites d'or** de la part de **" + message.author.username + "**. Utilisez la commande `hg redeem` pour les récupérer...")
                loginfo = "Commande #" + commandId + " de l'objet donation-" + selection + " effectuée par " + message.author.username + " validée"
                showLog();
            }else{
                message.channel.send(":no_entry: Votre solde actuel (**" + golds + " pépites d'or**) n'est pas suffisant. Pour effectuer un don, vous devez avoir au moins **10 pépites d'or**.")
            }
    }else if (selection.startsWith("4")) {
        if (xp >= 10) {
            db.push("/game/" + message.author.id + "/xp", xp - 10);
            var destXp = db.getData("/game/" + destUser + "/bonus/xpBottle")
            db.push("/game/" + destUser + "/bonus/xpBottle", destXp + 1);
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            var commandId = getRandomArbitrary(100, 99999);
            message.channel.send(":white_check_mark: Votre don *#" + commandId + "* de **10 points d'expérience** pour **" + message.mentions.user.first().username + "** a été validé - `" + message.author.username + "`")
            message.mentions.user.first().send("🔔 Vous avez reçu une **fiole d'expérience *(10 points d'expérience)*** de la part de **" + message.author.username + "**. Utilisez la commande `hg redeem` pour les récupérer...")
            loginfo = "Commande #" + commandId + " de l'objet donation-" + selection + " effectuée par " + message.author.username + " validée"
            showLog();
        }else{
            message.channel.send(":no_entry: Votre expérience dans le niveau actuel actuel (**" + xp + "/500**) n'est pas suffisant. Pour effectuer un don, vous devez avoir au moins **10/500**.")
        }}else{
            message.channel.send(":no_entry: L'élément de don avec l'identifiant spécifié est introuvable. Vérifiez l'orthographe et réessayez... - `" + message.author.username + "`")
        }
}}}

function giftInvalidUser() {
    message = lstmsg
    var destUser
    try {
    destUser = message.mentions.users.first().username
    } catch(error) {}
    if (destUser) {
    message.channel.send(":no_entry: L'utilisateur **" + destUser + "** n'a pas initialisé son profil.")
    } else {
        message.channel.send(":no_entry: L'utilisateur spécifié est introuvable, ou alors vous n'avez mentionné aucun utilisateur...")
    }
}

function giftCannotGiveYourself() {
    message = lstmsg
    message.channel.send(":no_entry: Vous ne pouvez pas vous faire de don à vous même")
}

function showLog() {
    if (config.keepLogs == true) {
    var date = new Date();
    var hour = date.getHours() + 1;
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var time = day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
    console.log(time + " [" + shard.id + "] : " + loginfo)
    fs.appendFile("horigame.log", "\n" + time + " [" + shard.id + "] : " + loginfo, (error) => { /* handle error */ })
    }else{
        var date = new Date();
        var hour = date.getHours() + 1;
        hour = (hour < 10 ? "0" : "") + hour;
        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        var time = day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
        console.log("[Horigame] [" + shard.id + "] " + time + " : " + loginfo)
}}