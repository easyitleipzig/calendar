INSERT INTO `user` (`id`, `salutation`, `lastname`, `firstname`, `email`, `phone`, `description`, `photo`, `newsletter`, `opt_in`, `street`, `house_number`, `postal_code`, `city`, `iban`, `institute`, `account_owner`, `last_login`, `last_activity`, `allow_ga`, `allow_tr`, `count_messages`, `remind_me`, `count_remind_emails`, `after_days`, `after_messages`, `avoid_chat`, `birthday`, `public`) VALUES (NULL, '0', 'fEmail1', '', 'fEmail1', '', '', '0', '0', '0', '', '', '', '', '', '', '', current_timestamp(), '2023-09-30 12:40:24.000000', '', '1', '', '0', '0', '', '', '0', '', '1');
INSERT INTO `user` (`id`, `salutation`, `lastname`, `firstname`, `email`, `phone`, `description`, `photo`, `newsletter`, `opt_in`, `street`, `house_number`, `postal_code`, `city`, `iban`, `institute`, `account_owner`, `last_login`, `last_activity`, `allow_ga`, `allow_tr`, `count_messages`, `remind_me`, `count_remind_emails`, `after_days`, `after_messages`, `avoid_chat`, `birthday`, `public`) VALUES (NULL, '0', 'fEmail2', '', 'fEmail2', '', '', '0', '0', '0', '', '', '', '', '', '', '', current_timestamp(), '2023-09-30 12:40:24.000000', '', '1', '', '0', '0', '', '', '0', '', '1');
INSERT INTO `role` (`role`, `sender_email`, `sender`, `public`) VALUES ('falscheEMail', '', '', 1);
INSERT INTO `account` (`user_id`, `role_id`, `password`, `activated`, `created_on`, `activated_on`) VALUES (1, 32, '', 0, NULL, NULL), (283, 32, '', 0, NULL, NULL), (284, 32, '', 0, NULL, NULL);
