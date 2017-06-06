/**
 * @file form表单
 */

'use strict';

//引入form的样式
require('./form.less');
require('./v-code-image-input.less');

//电话输入框
import NumberInput from './number-input';
//电话输入框
import PhoneInput from './phone-input';
//银行卡号输入框
import BankNumberInput from './bank-number-input';
//真实姓名输入框
import RealNameInput from './real-name-input';

//身份证码输入框
import IDNumberInput from './id-number-input';

import CommonInput from './common-input';

import SimulateInput from './SimulateInput';

//密码输入框
import PasswordInput from './password-input';
//验证码输入框
import VCodeInput from './v-code-input';
//验证码输入框   带定时器的
import VCodeTimerInput from './v-code-timer-input';
//根据图片填写的验证码输入框
import VCodeImgInput from './v-code-img-input';
import VCodeImageInput from './v-code-image-input';
// 密码强度
import PasswordLevel from './password-level';
//按钮
import Button from './button';
//按钮
import Btn from './btn';

//验证码输入框   带定时器的
import KeybordCommonInput from './keybord-common-input';

export { NumberInput }
export { PasswordInput }
export { VCodeInput }
export { VCodeImgInput }
export { PasswordLevel }
export { Button }
export { Btn }
export { PhoneInput }
export { BankNumberInput }
export { RealNameInput }
export { IDNumberInput }
export { VCodeTimerInput }
export { KeybordCommonInput }
export { CommonInput }
export { SimulateInput }
export { VCodeImageInput }

export default {
	NumberInput,
	PasswordInput,
	VCodeInput,
	VCodeImgInput,
	PasswordLevel,
	Button,
	Btn,
	PhoneInput,
	BankNumberInput,
	RealNameInput,
	IDNumberInput,
	VCodeTimerInput,
	KeybordCommonInput,
	CommonInput,
	SimulateInput,
	VCodeImageInput
}