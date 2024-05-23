import React, { useState } from 'react';
import { Box, Flex, Input, useToast } from '@chakra-ui/react';

const Index = () => {
  const [inputValue, setInputValue] = useState('');
  const toast = useToast();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      toast({
        title: 'Input submitted.',
        description: `You entered: ${inputValue}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      setInputValue('');
    }
  };

  return (
    <Flex height="100vh">
      <Box width="25%" p={4} borderRight="1px solid #ccc">
        <Input
          placeholder="Type your message here..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </Box>
      <Box width="75%" p={4}>
        <iframe
          title="Output"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </Box>
    </Flex>
  );
};

export default Index;