import random
import string


#Random string with only lower
def get_random_string_lower(length):
    lower = string.ascii_lowercase
    result_str = ''.join(random.choice(lower) for i in range(length))
    return result_str

#random string with only upper
def get_random_string_upper(length):
    upper = string.ascii_uppercase
    result_str = ''.join(random.choice(upper) for i in range(length))
    return result_str


#Random string with only num
def get_random_string_num(length):
    num = string.digits
    result_str = ''.join(random.choice(num) for i in range(length))
    return result_str

#Random string with lower, upper and num
def get_random_string_goodps(length):
    lower = string.ascii_lowercase
    upper = string.ascii_uppercase
    num = string.digits
    all = lower + upper + num
    result_str = ''.join(random.choice(all) for i in range(length))
    return result_str

def get_email():
    return "test" + "@" + get_random_string_lower(4) + ".com"

#Random string with special characters
def get_random_string_special():
    return ''.join([random.choice(string.punctuation) for n in range(12)])


#random negative number
def get_rand_negative():
    return random.randint(-1000, 0)


