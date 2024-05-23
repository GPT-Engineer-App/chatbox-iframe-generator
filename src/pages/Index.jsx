import React, { useState } from 'react';
import { create } from '../lib/openai';
import { Box, Flex, Input, useToast } from '@chakra-ui/react';

const Index = () => {
  const [inputValue, setInputValue] = useState('');
  const toast = useToast();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      try {
        const response = await create({
          messages: [{ role: 'user', content: inputValue }],
          model: 'gpt-4'
        });

        const generatedContent = response.choices[0].message.content;

        const iframe = document.querySelector('iframe');
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(generatedContent);
        iframeDocument.close();

        toast({
          title: 'Content generated.',
          description: 'The content has been generated and rendered in the iframe.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        setInputValue('');
      } catch (error) {
        console.error('Error generating content:', error);
        toast({
          title: 'Error.',
          description: 'There was an error generating the content.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
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