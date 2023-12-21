import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import inquirer from 'inquirer';
import fs from 'fs/promises';
import colors from '@colors/colors';

const getNitro = async () => {
  let attempts = 3;

  while (attempts > 0) {
    try {
      let token;
      const url = 'https://api.discord.gx.games/v1/direct-fulfillment';
      const headers = {
        'Content-Type': 'application/json',
        'Sec-Ch-Ua':
          '"Opera GX";v="105", "Chromium";v="119", "Not?A_Brand";v="24"',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0',
      };
      const data = {
        partnerUserId: uuidv4(),
      };
      const response = await axios.post(url, data, { headers });

      if (response.data.token) {
        token = response.data.token;
        console.log(`${colors.green('! success get promo code')}`);
        const link = `https://discord.com/billing/partner-promotions/1180231712274387115/${token}`;
        return link;
      } else {
        console.log('Failed to get token');
      }
    } catch (error) {
      console.error(error.data?.message);
    }
    attempts--;
  }
  console.log('All attempts failed');
  return null;
};

(async () => {
  try {
    console.clear();
    console.log('Made with ❤️ by janexmgd www.facebook.com/janexmgd\n');
    const { howMany } = await inquirer.prompt({
      name: 'howMany',
      type: 'input',
      message: 'how many do you want to generate discord nitro code ? ',
      validate: (input) => {
        const numberInput = Number(input);
        const isValid = Number.isInteger(numberInput) && numberInput > 0;
        return isValid || 'Please enter a positive integer.';
      },
    });
    const links = [];
    let count = howMany;
    while (count > 0) {
      const link = await getNitro();
      links.push(link);
      count--;
    }
    await fs.appendFile('result.txt', links.join('\n'));
    console.log(`${colors.green('! task success')}`);
  } catch (error) {
    console.log(error);
  }
})();
