import sys
import re

def peek_line(f):
    pos = f.tell()
    line = f.readline()
    f.seek(pos)
    return line
    
def process_file(filename):
    print('Processing file:', filename)
    with open(filename) as f:
        CUs = []
        if re.search(r'^ <0>', peek_line(f)):
            CUs.append(parse_cu(f))

def parse_cu(f):
    this = {}
    while re.search(r'^    <[0-9a-fA-F]+>', peek_line(f)):
        line = f.readline()
    
    line = peek_line(f)
    
    if re.search(r'^ <1>', peek_line(f)):
        
            
def parse_dw(f):
    dw = {
        children : []
    }
    
    line = peek_line(f)
    level = 0
    
    level_search = re.search(r' <([\d+])>', line)
    if level_search:
        level = level_search.group(1)
    
    if re.search(r'DW_TAG_namespace', line):
        dw = parse_namespace(f)
    elif re.search(r'DW_TAG_typedef', line):
        dw = parse_typedef(f)
    elif re.search(r'DW_TAG_class_type', line):
        dw = parse_class_type(f)
    elif re.search(r'DW_TAG_subprogram', line):
        dw = parse_subprogram(f)
    elif re.search(r'DW_TAG_formal_parameter', line):
        dw = parse_formal_parameter(f)
    elif re.search(r'DW_TAG_const_type', line):
        dw = parse_const_type(f)
    elif re.search(r'DW_TAG_template_type_param', line):
        dw = parse_template_type_param(f)
    elif re.search(r'DW_TAG_member', line):
        dw = parse_member(f)
        
    line = peek_line(f)
    level_search = re.search(r' <([\d+])>', line)
    if level_search:
        next_level = level_search.group(1)
        if next_level == level + 1:
            dw.children.append(parse_dw(f))
        

if __name__ == '__main__':
    for filename in sys.argv[1:]:
        process_file(filename)