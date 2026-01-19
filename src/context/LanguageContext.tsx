import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

// Translations
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.browse': 'Explorer',
    'nav.requests': 'Demandes',
    'nav.wallet': 'Portefeuille',
    'nav.profile': 'Profil',
    'nav.dashboard': 'Tableau de bord',
    'nav.login': 'Connexion',
    
    // Menu
    'menu.profile': 'Mon Profil',
    'menu.profileHint': 'Gérer votre compte',
    'menu.settings': 'Paramètres',
    'menu.settingsHint': 'Préférences de l\'application',
    'menu.switchRole': 'Changer de rôle',
    'menu.preferences': 'Préférences',
    'menu.language': 'Arabe',
    'menu.darkMode': 'Mode sombre',
    'menu.loginHint': 'Connectez-vous pour accéder',
    
    // Logout
    'logout.title': 'Déconnexion',
    'logout.simpleMessage': 'Êtes-vous sûr de vouloir vous déconnecter?',
    'logout.workerMessage': 'Avant de vous déconnecter, choisissez votre statut de disponibilité.',
    'logout.driverWarning': 'Si vous restez disponible, vous recevrez des notifications pour de nouvelles courses même déconnecté.',
    'logout.sellerWarning': 'Si vous restez disponible, votre boutique restera visible et vous recevrez des demandes.',
    'logout.stayAvailable': 'Rester disponible',
    'logout.stayAvailableDesc': 'Continuer à recevoir des demandes et notifications',
    'logout.goOffline': 'Passer hors ligne',
    'logout.goOfflineDesc': 'Arrêter de recevoir des demandes jusqu\'à la prochaine connexion',
    'logout.confirm': 'Confirmer la déconnexion',
    
    // Access Control
    'access.loginRequired': 'Connexion requise',
    'access.featureRequiresLogin': 'Pour accéder à {feature}, veuillez vous connecter.',
    'access.genericMessage': 'Connectez-vous pour débloquer toutes les fonctionnalités de la plateforme.',
    'access.loginToAccess': 'Connectez-vous pour accéder',
    'access.proFeature': 'PRO',
    'access.unauthorized': 'Accès non autorisé',
    'access.noRoleAccess': 'Vous n\'avez pas les permissions nécessaires pour cette page.',
    
    // Explore Mode
    'explore.button': 'Explorer',
    'explore.modeTitle': 'Mode Découverte',
    'explore.previous': 'Précédent',
    'explore.next': 'Suivant',
    'explore.finish': 'Terminer',
    'explore.actionClick': 'Cliquez sur cet élément pour interagir',
    'explore.actionScroll': 'Faites défiler pour voir plus',
    'explore.actionObserve': 'Observez cette section pour comprendre',
    
    // Landing Page Tour
    'explore.landing.welcome.title': 'Bienvenue sur Zynora!',
    'explore.landing.welcome.desc': 'Zynora est une plateforme intelligente qui connecte acheteurs, vendeurs et livreurs en Algérie. Découvrons ensemble comment ça marche!',
    'explore.landing.request.title': 'Demandes Intelligentes',
    'explore.landing.request.desc': 'Décrivez ce dont vous avez besoin, ajoutez votre lieu et votre budget. Les vendeurs près de vous recevront votre demande instantanément.',
    'explore.landing.roles.title': 'Trois Rôles, Une Plateforme',
    'explore.landing.roles.desc': 'Acheteur: Trouvez et commandez ce dont vous avez besoin. Vendeur: Recevez des demandes et proposez vos offres. Livreur: Effectuez des livraisons et gagnez de l\'argent.',
    'explore.landing.trust.title': 'Système de Confiance',
    'explore.landing.trust.desc': 'Chaque utilisateur a un score de confiance basé sur ses transactions. Plus le score est élevé, plus vous êtes fiable!',
    
    // Buyer Tour
    'explore.buyer.offers.title': 'Vos Offres',
    'explore.buyer.offers.desc': 'Ici vous verrez toutes les offres des vendeurs pour vos demandes. Comparez les prix, délais et scores de confiance.',
    'explore.buyer.compare.title': 'Comparer les Offres',
    'explore.buyer.compare.desc': 'Utilisez les filtres pour trier par prix ou par score de confiance. Choisissez la meilleure offre pour vous.',
    'explore.buyer.payment.title': 'Paiement Sécurisé',
    'explore.buyer.payment.desc': 'Payez avec Carte Edahabia ou en espèces à la livraison. Votre argent est protégé jusqu\'à confirmation de réception.',
    
    // Seller Tour
    'explore.seller.requests.title': 'Demandes Entrantes',
    'explore.seller.requests.desc': 'Voyez les demandes des acheteurs près de vous. Répondez rapidement pour augmenter vos chances!',
    'explore.seller.offer.title': 'Soumettre une Offre',
    'explore.seller.offer.desc': 'Proposez votre prix, temps de préparation et ajoutez des photos de vos produits.',
    'explore.seller.escrow.title': 'Paiements Sécurisés',
    'explore.seller.escrow.desc': 'Les paiements sont conservés en séquestre et libérés après confirmation de livraison. Protection garantie!',
    'nav.signup': 'Inscription',
    'nav.logout': 'Déconnexion',
    
    // Landing Page
    'landing.hero.title': 'Bienvenue sur Zynora',
    'landing.hero.subtitle': 'Le système d\'opportunités intelligent de l\'Algérie',
    'landing.hero.cta': 'Envoyer une Demande',
    'landing.smartRequest.placeholder': 'Que cherchez-vous? Décrivez votre besoin...',
    'landing.smartRequest.location': 'Lieu de livraison',
    'landing.smartRequest.time': 'Quand en avez-vous besoin?',
    'landing.smartRequest.budget': 'Budget estimé (DA)',
    'landing.smartRequest.submit': 'Envoyer la Demande',
    
    // Buyer
    'buyer.offers.title': 'Offres Reçues',
    'buyer.offers.empty': 'Aucune offre pour le moment',
    'buyer.offers.compare': 'Comparer',
    'buyer.offers.choose': 'Choisir',
    'buyer.offers.price': 'Prix',
    'buyer.offers.delivery': 'Livraison',
    'buyer.offers.trust': 'Score de Confiance',
    'buyer.tracking.title': 'Suivi de Commande',
    'buyer.history.title': 'Historique',
    
    // Seller
    'seller.dashboard.title': 'Tableau de Bord Vendeur',
    'seller.requests.incoming': 'Demandes Entrantes',
    'seller.offers.accepted': 'Offres Acceptées',
    'seller.escrow.payments': 'Paiements en Séquestre',
    'seller.offer.submit': 'Soumettre une Offre',
    'seller.offer.price': 'Votre Prix (DA)',
    'seller.offer.time': 'Temps de Préparation',
    'seller.offer.note': 'Note (optionnel)',
    
    // Driver
    'driver.dashboard.title': 'Tableau de Bord Livreur',
    'driver.availability.available': 'Disponible',
    'driver.availability.unavailable': 'Non Disponible',
    'driver.requests.nearby': 'Demandes à Proximité',
    'driver.earnings.title': 'Gains',
    'driver.trust.title': 'Score de Confiance',
    'driver.night.bonus': 'Bonus de Nuit',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.retry': 'Réessayer',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.save': 'Enregistrer',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.all': 'Tout',
    'common.today': 'Aujourd\'hui',
    'common.now': 'Maintenant',
    'common.minutes': 'minutes',
    'common.hours': 'heures',
    'common.km': 'km',
    'common.da': 'DA',
    
    // Trust Score
    'trust.high': 'Confiance Élevée',
    'trust.medium': 'Confiance Moyenne',
    'trust.low': 'Confiance Faible',
    'trust.new': 'Nouveau',
    
    // Status
    'status.pending': 'En attente',
    'status.accepted': 'Accepté',
    'status.preparing': 'En préparation',
    'status.onway': 'En route',
    'status.delivered': 'Livré',
    'status.completed': 'Terminé',
    'status.cancelled': 'Annulé',
    
    // Image Upload
    'seller.offer.images': 'Photos du produit',
    'upload.dragDrop': 'Glissez vos images ici ou',
    'upload.browse': 'parcourir',
    'upload.hint': 'JPEG, PNG ou WebP. Max 5MB',
    'upload.remaining': 'restantes',
    'upload.main': 'Principale',
    'upload.images': 'images',
    'upload.error.invalidType': 'Type de fichier invalide',
    'upload.error.tooLarge': 'Fichier trop volumineux (max 5MB)',
    'common.noImages': 'Pas d\'images',
    
    // Payment - Carte Edahabia
    'payment.title': 'Paiement Sécurisé',
    'payment.edahabia.title': 'Paiement par Carte Edahabia',
    'payment.edahabia.subtitle': 'Algérie Poste - Carte Dorée',
    'payment.amount': 'Montant à payer',
    'payment.cardNumber': 'Numéro de carte',
    'payment.cardHolder': 'Nom du titulaire',
    'payment.cardHolderPlaceholder': 'Nom tel qu\'il apparaît sur la carte',
    'payment.expiry': 'Date d\'expiration',
    'payment.cvv': 'CVV',
    'payment.payButton': 'Payer',
    'payment.processing': 'Traitement en cours...',
    'payment.escrowNote': 'Votre paiement sera conservé en séquestre jusqu\'à la confirmation de livraison. Protection acheteur garantie.',
    'payment.success.title': 'Paiement Réussi!',
    'payment.success.escrowMessage': 'Votre paiement est sécurisé en séquestre. Le vendeur sera payé après confirmation de livraison.',
    'payment.error.invalidCardNumber': 'Numéro de carte invalide',
    'payment.error.notEdahabia': 'Veuillez entrer une carte Edahabia valide',
    'payment.error.invalidCard': 'Numéro de carte invalide',
    'payment.error.invalidExpiry': 'Format invalide (MM/AA)',
    'payment.error.invalidMonth': 'Mois invalide',
    'payment.error.expired': 'Carte expirée',
    'payment.error.invalidCVV': 'CVV doit être 3 chiffres',
    'payment.error.failed': 'Le paiement a échoué',
    'payment.methods.edahabia': 'Carte Edahabia',
    'payment.methods.edahabiaDesc': 'Paiement par carte Algérie Poste',
    'payment.methods.ccp': 'Virement CCP',
    'payment.methods.ccpDesc': 'Transfert vers compte postal',
    'payment.methods.cash': 'Paiement à la livraison',
    'payment.methods.cashDesc': 'Payez en espèces au livreur',
    'payment.ccpInstructions': 'Les instructions de virement CCP seront envoyées par SMS',
    'payment.cashInstructions': 'Préparez le montant exact pour le livreur',
    
    // Escrow
    'escrow.buyer': 'Acheteur',
    'escrow.seller': 'Vendeur',
    'escrow.protected': 'Transaction protégée par Zynora',
    'escrow.confirmDelivery': 'Confirmer la livraison',
    'escrow.requestRefund': 'Demander un remboursement',
    'escrow.securityNote': 'Votre argent est en sécurité. Il ne sera libéré au vendeur qu\'après confirmation de réception.',
    'escrow.step.payment': 'Paiement reçu',
    'escrow.step.paymentDesc': 'Votre paiement a été sécurisé',
    'escrow.step.held': 'Fonds en séquestre',
    'escrow.step.heldDesc': 'Argent conservé en toute sécurité',
    'escrow.step.delivery': 'En cours de livraison',
    'escrow.step.deliveryDesc': 'Votre commande est en route',
    'escrow.step.release': 'Paiement libéré',
    'escrow.step.releaseDesc': 'Vendeur payé après confirmation',
    'escrow.status.awaitingPayment': 'En attente de paiement',
    'escrow.status.paymentReceived': 'Paiement reçu',
    'escrow.status.awaitingDelivery': 'En attente de livraison',
    'escrow.status.deliveryConfirmed': 'Livraison confirmée',
    'escrow.status.releasedToSeller': 'Payé au vendeur',
    'escrow.status.refunded': 'Remboursé',
    'escrow.status.disputed': 'Litige en cours',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.browse': 'استكشاف',
    'nav.requests': 'الطلبات',
    'nav.wallet': 'المحفظة',
    'nav.profile': 'الملف الشخصي',
    'nav.dashboard': 'لوحة التحكم',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.logout': 'تسجيل الخروج',
    
    // Menu
    'menu.profile': 'ملفي الشخصي',
    'menu.profileHint': 'إدارة حسابك',
    'menu.settings': 'الإعدادات',
    'menu.settingsHint': 'تفضيلات التطبيق',
    'menu.switchRole': 'تغيير الدور',
    'menu.preferences': 'التفضيلات',
    'menu.language': 'الفرنسية',
    'menu.darkMode': 'الوضع الداكن',
    'menu.loginHint': 'سجل الدخول للوصول',
    
    // Logout
    'logout.title': 'تسجيل الخروج',
    'logout.simpleMessage': 'هل أنت متأكد من أنك تريد تسجيل الخروج؟',
    'logout.workerMessage': 'قبل تسجيل الخروج، اختر حالة التوفر الخاصة بك.',
    'logout.driverWarning': 'إذا بقيت متاحاً، ستتلقى إشعارات للرحلات الجديدة حتى بعد تسجيل الخروج.',
    'logout.sellerWarning': 'إذا بقيت متاحاً، سيظل متجرك مرئياً وستتلقى الطلبات.',
    'logout.stayAvailable': 'البقاء متاحاً',
    'logout.stayAvailableDesc': 'الاستمرار في تلقي الطلبات والإشعارات',
    'logout.goOffline': 'الانتقال لوضع عدم الاتصال',
    'logout.goOfflineDesc': 'التوقف عن تلقي الطلبات حتى تسجيل الدخول التالي',
    'logout.confirm': 'تأكيد تسجيل الخروج',
    
    // Access Control
    'access.loginRequired': 'تسجيل الدخول مطلوب',
    'access.featureRequiresLogin': 'للوصول إلى {feature}، يرجى تسجيل الدخول.',
    'access.genericMessage': 'سجل الدخول لفتح جميع ميزات المنصة.',
    'access.loginToAccess': 'سجل الدخول للوصول',
    'access.proFeature': 'PRO',
    'access.unauthorized': 'وصول غير مصرح',
    'access.noRoleAccess': 'ليس لديك الصلاحيات اللازمة لهذه الصفحة.',
    
    // Explore Mode (changed to Learn)
    'explore.button': 'تعلّم',
    'explore.modeTitle': 'وضع التعلم',
    'explore.previous': 'السابق',
    'explore.next': 'التالي',
    'explore.finish': 'إنهاء',
    'explore.actionClick': 'انقر على هذا العنصر للتفاعل',
    'explore.actionScroll': 'مرر لرؤية المزيد',
    'explore.actionObserve': 'راقب هذا القسم للفهم',
    
    // Landing Page Tour
    'explore.landing.welcome.title': 'مرحباً بكم في زينورا!',
    'explore.landing.welcome.desc': 'زينورا منصة ذكية تربط المشترين والبائعين والسائقين في الجزائر. دعنا نكتشف كيف تعمل معاً!',
    'explore.landing.request.title': 'الطلبات الذكية',
    'explore.landing.request.desc': 'صف ما تحتاجه، أضف موقعك وميزانيتك. سيتلقى البائعون القريبون منك طلبك فوراً.',
    'explore.landing.roles.title': 'ثلاثة أدوار، منصة واحدة',
    'explore.landing.roles.desc': 'مشتري: ابحث واطلب ما تحتاجه. بائع: استقبل الطلبات وقدم عروضك. سائق: أوصل واكسب المال.',
    'explore.landing.trust.title': 'نظام الثقة',
    'explore.landing.trust.desc': 'لكل مستخدم درجة ثقة بناءً على معاملاته. كلما ارتفعت النتيجة، كنت أكثر موثوقية!',
    
    // Buyer Tour
    'explore.buyer.offers.title': 'عروضك',
    'explore.buyer.offers.desc': 'هنا سترى جميع عروض البائعين لطلباتك. قارن الأسعار والمواعيد ودرجات الثقة.',
    'explore.buyer.compare.title': 'مقارنة العروض',
    'explore.buyer.compare.desc': 'استخدم الفلاتر للترتيب حسب السعر أو درجة الثقة. اختر أفضل عرض لك.',
    'explore.buyer.payment.title': 'الدفع الآمن',
    'explore.buyer.payment.desc': 'ادفع ببطاقة الذهبية أو نقداً عند التسليم. أموالك محمية حتى تأكيد الاستلام.',
    
    // Seller Tour
    'explore.seller.requests.title': 'الطلبات الواردة',
    'explore.seller.requests.desc': 'شاهد طلبات المشترين القريبين منك. استجب بسرعة لزيادة فرصك!',
    'explore.seller.offer.title': 'تقديم عرض',
    'explore.seller.offer.desc': 'اقترح سعرك ووقت التحضير وأضف صور منتجاتك.',
    'explore.seller.escrow.title': 'مدفوعات آمنة',
    'explore.seller.escrow.desc': 'يتم الاحتفاظ بالمدفوعات في الضمان وتحريرها بعد تأكيد التسليم. حماية مضمونة!',
    
    // Landing Page
    'landing.hero.title': 'مرحباً بكم في زينورا',
    'landing.hero.subtitle': 'نظام الفرص الذكي في الجزائر',
    'landing.hero.cta': 'أرسل طلبك',
    'landing.smartRequest.placeholder': 'ما الذي تبحث عنه؟ صف احتياجك...',
    'landing.smartRequest.location': 'مكان التوصيل',
    'landing.smartRequest.time': 'متى تحتاجه؟',
    'landing.smartRequest.budget': 'الميزانية المقدرة (دج)',
    'landing.smartRequest.submit': 'إرسال الطلب',
    
    // Buyer
    'buyer.offers.title': 'العروض المستلمة',
    'buyer.offers.empty': 'لا توجد عروض حالياً',
    'buyer.offers.compare': 'قارن',
    'buyer.offers.choose': 'اختر',
    'buyer.offers.price': 'السعر',
    'buyer.offers.delivery': 'التوصيل',
    'buyer.offers.trust': 'درجة الثقة',
    'buyer.tracking.title': 'تتبع الطلب',
    'buyer.history.title': 'السجل',
    
    // Seller
    'seller.dashboard.title': 'لوحة تحكم البائع',
    'seller.requests.incoming': 'الطلبات الواردة',
    'seller.offers.accepted': 'العروض المقبولة',
    'seller.escrow.payments': 'المدفوعات المحجوزة',
    'seller.offer.submit': 'تقديم عرض',
    'seller.offer.price': 'سعرك (دج)',
    'seller.offer.time': 'وقت التحضير',
    'seller.offer.note': 'ملاحظة (اختياري)',
    
    // Driver
    'driver.dashboard.title': 'لوحة تحكم السائق',
    'driver.availability.available': 'متاح',
    'driver.availability.unavailable': 'غير متاح',
    'driver.requests.nearby': 'الطلبات القريبة',
    'driver.earnings.title': 'الأرباح',
    'driver.trust.title': 'درجة الثقة',
    'driver.night.bonus': 'مكافأة الليل',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.retry': 'إعادة المحاولة',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.save': 'حفظ',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.search': 'بحث',
    'common.filter': 'فلترة',
    'common.sort': 'ترتيب',
    'common.all': 'الكل',
    'common.today': 'اليوم',
    'common.now': 'الآن',
    'common.minutes': 'دقائق',
    'common.hours': 'ساعات',
    'common.km': 'كم',
    'common.da': 'دج',
    
    // Trust Score
    'trust.high': 'ثقة عالية',
    'trust.medium': 'ثقة متوسطة',
    'trust.low': 'ثقة منخفضة',
    'trust.new': 'جديد',
    
    // Status
    'status.pending': 'قيد الانتظار',
    'status.accepted': 'مقبول',
    'status.preparing': 'قيد التحضير',
    'status.onway': 'في الطريق',
    'status.delivered': 'تم التوصيل',
    'status.completed': 'مكتمل',
    'status.cancelled': 'ملغى',
    
    // Image Upload
    'seller.offer.images': 'صور المنتج',
    'upload.dragDrop': 'اسحب الصور هنا أو',
    'upload.browse': 'تصفح',
    'upload.hint': 'JPEG، PNG أو WebP. الحد الأقصى 5 ميجابايت',
    'upload.remaining': 'متبقية',
    'upload.main': 'رئيسية',
    'upload.images': 'صور',
    'upload.error.invalidType': 'نوع ملف غير صالح',
    'upload.error.tooLarge': 'الملف كبير جداً (الحد 5 ميجابايت)',
    'common.noImages': 'لا توجد صور',
    
    // Payment - Carte Edahabia
    'payment.title': 'الدفع الآمن',
    'payment.edahabia.title': 'الدفع ببطاقة الذهبية',
    'payment.edahabia.subtitle': 'بريد الجزائر - البطاقة الذهبية',
    'payment.amount': 'المبلغ المستحق',
    'payment.cardNumber': 'رقم البطاقة',
    'payment.cardHolder': 'اسم حامل البطاقة',
    'payment.cardHolderPlaceholder': 'الاسم كما يظهر على البطاقة',
    'payment.expiry': 'تاريخ الانتهاء',
    'payment.cvv': 'رمز الأمان',
    'payment.payButton': 'ادفع',
    'payment.processing': 'جاري المعالجة...',
    'payment.escrowNote': 'سيتم الاحتفاظ بمبلغك في حساب الضمان حتى تأكيد التسليم. حماية المشتري مضمونة.',
    'payment.success.title': 'تم الدفع بنجاح!',
    'payment.success.escrowMessage': 'دفعتك آمنة في حساب الضمان. سيتم الدفع للبائع بعد تأكيد الاستلام.',
    'payment.error.invalidCardNumber': 'رقم البطاقة غير صالح',
    'payment.error.notEdahabia': 'الرجاء إدخال بطاقة ذهبية صالحة',
    'payment.error.invalidCard': 'رقم البطاقة غير صالح',
    'payment.error.invalidExpiry': 'صيغة غير صالحة (شهر/سنة)',
    'payment.error.invalidMonth': 'شهر غير صالح',
    'payment.error.expired': 'البطاقة منتهية الصلاحية',
    'payment.error.invalidCVV': 'رمز الأمان يجب أن يكون 3 أرقام',
    'payment.error.failed': 'فشل الدفع',
    'payment.methods.edahabia': 'بطاقة الذهبية',
    'payment.methods.edahabiaDesc': 'الدفع ببطاقة بريد الجزائر',
    'payment.methods.ccp': 'تحويل CCP',
    'payment.methods.ccpDesc': 'تحويل إلى حساب بريدي',
    'payment.methods.cash': 'الدفع عند الاستلام',
    'payment.methods.cashDesc': 'ادفع نقداً للسائق',
    'payment.ccpInstructions': 'سيتم إرسال تعليمات التحويل عبر SMS',
    'payment.cashInstructions': 'جهّز المبلغ المحدد للسائق',
    
    // Escrow
    'escrow.buyer': 'المشتري',
    'escrow.seller': 'البائع',
    'escrow.protected': 'معاملة محمية بواسطة زينورا',
    'escrow.confirmDelivery': 'تأكيد الاستلام',
    'escrow.requestRefund': 'طلب استرداد',
    'escrow.securityNote': 'أموالك آمنة. لن يتم تحويلها للبائع إلا بعد تأكيد الاستلام.',
    'escrow.step.payment': 'تم استلام الدفعة',
    'escrow.step.paymentDesc': 'تم تأمين دفعتك',
    'escrow.step.held': 'الأموال في الضمان',
    'escrow.step.heldDesc': 'الأموال محفوظة بأمان',
    'escrow.step.delivery': 'قيد التوصيل',
    'escrow.step.deliveryDesc': 'طلبك في الطريق',
    'escrow.step.release': 'تم تحرير الدفعة',
    'escrow.step.releaseDesc': 'تم الدفع للبائع بعد التأكيد',
    'escrow.status.awaitingPayment': 'في انتظار الدفع',
    'escrow.status.paymentReceived': 'تم استلام الدفعة',
    'escrow.status.awaitingDelivery': 'في انتظار التوصيل',
    'escrow.status.deliveryConfirmed': 'تم تأكيد التوصيل',
    'escrow.status.releasedToSeller': 'تم الدفع للبائع',
    'escrow.status.refunded': 'تم الاسترداد',
    'escrow.status.disputed': 'نزاع قيد المراجعة',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('zynora-lang');
    return (saved === 'ar' || saved === 'fr') ? saved : 'fr';
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = direction === 'rtl';

  useEffect(() => {
    localStorage.setItem('zynora-lang', language);
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'fr' ? 'ar' : 'fr'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, isRTL, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
